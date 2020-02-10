import React, { useContext, useEffect, useRef, useState } from "react";
import { Card, CategoryCard } from "./Card";
import { ColourPicker } from "./colour/ColourPicker";
import {
  assignColours,
  Colour,
  ColourMap,
  colourString,
  defaultColour
} from "./colour/definition";
import {
  DataMap,
  getDataKind,
  sortedCategorySteps,
  sortedSteps,
  sortObject
} from "./data";
import { DataLoader } from "./DataLoader";
import { Empty } from "./Empty";
import { useDragScroll } from "./hook/drag";
import * as styles from "./Images.styles";
import { roundFloat, stringToFloat } from "./number";
import { OverlayContext } from "./Overlay";

const ExpandIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352.054 352.054">
    <path d="M144.206 186.634L30 300.84v-62.781H0v113.995h113.995v-30H51.212l114.207-114.207zM238.059 0v30h62.781L186.633 144.208l21.213 21.212L322.054 51.213v62.782h30V0z" />
  </svg>
);

export type Bbox = {
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
  className?: string;
  probability?: number;
};

// To get a unique key for React arrays.
function bboxKey(bbox: Bbox): string {
  const values = [
    bbox.xStart,
    bbox.yStart,
    bbox.xEnd,
    bbox.yEnd,
    bbox.className,
    bbox.probability
  ];
  return values.join("-");
}

type Thumbnail = {
  base64: string;
  width: number;
  height: number;
};

export type Image = {
  source: string;
  thumbnail?: Thumbnail;
  classes?: Array<string>;
  boxes?: Array<Bbox>;
  minProbability?: number;
};

type ClassListProps = {
  classes: Array<string>;
  classColours: ColourMap;
  setClassColour: (className: string, colour: Colour) => void;
};

const ClassList: React.FC<ClassListProps> = ({
  classes,
  classColours,
  setClassColour
}) => {
  const [shownColourPicker, setShownColourPicker] = useState<
    string | undefined
  >(undefined);
  return (
    <div className={styles.classList}>
      <span className={styles.classListTitle}>Classes</span>
      {classes.map(className => {
        const colour: Colour = classColours.get(className) || defaultColour;
        return (
          <div key={className} className={styles.classEntry}>
            <span
              className={styles.colour}
              style={{ background: colourString(colour) }}
              onClick={() => setShownColourPicker(className)}
            />
            <span>{className}</span>
            {shownColourPicker === className && (
              <ColourPicker
                colour={colour}
                onSelect={colour => {
                  setShownColourPicker(undefined);
                  setClassColour(className, colour);
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

type BoundingBoxProps = {
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
  className?: string;
  probability?: number;
  classColours: ColourMap;
  maxWidth?: number;
  maxHeight?: number;
};

const BoundingBox: React.FC<BoundingBoxProps> = ({
  xStart,
  yStart,
  xEnd,
  yEnd,
  className,
  classColours,
  maxWidth,
  maxHeight
}) => {
  const colour: Colour =
    (className && classColours.get(className)) || defaultColour;
  // The paths draw the lines such that the centre of the line is exactly on the
  // specified coordinates. In order to have the line outside of the actual
  // covered area (i.e. the coordinates represent the very first pixel that is
  // inside the bounding box), half of the stroke width need to be
  // subtracted/added, except when the line would be outside of the image.
  const xS = Math.max(styles.strokeWidth / 2, xStart - styles.strokeWidth / 2);
  let xE = xEnd + styles.strokeWidth / 2;
  if (maxWidth) {
    xE = Math.min(xE, maxWidth - styles.strokeWidth / 2);
  }
  const yS = Math.max(styles.strokeWidth / 2, yStart - styles.strokeWidth / 2);
  let yE = yEnd + styles.strokeWidth / 2;
  if (maxHeight) {
    yE = Math.min(yE, maxHeight - styles.strokeWidth / 2);
  }
  return (
    <path
      fill="none"
      stroke={colourString(colour)}
      d={`M${xS},${yS} L${xE},${yS} L${xE},${yE} L${xS},${yE} Z`}
    />
  );
};

function boxesInside(
  boxes: Array<Bbox>,
  x: number,
  y: number,
  border: number = styles.strokeWidth,
  scaleFactor: number = 1.0
): Array<Bbox> {
  return boxes.filter(
    box =>
      scaleFactor * (box.xStart - border) <= x &&
      scaleFactor * (box.xEnd + border) >= x &&
      scaleFactor * (box.yStart - border) <= y &&
      scaleFactor * (box.yEnd + border) >= y
  );
}

type ImageSize = {
  width?: number;
  height?: number;
};

type ImageOverlayProps = {
  image: Image;
  name: string;
  fullscreen?: boolean;
  showOverlay?: () => void;
  dragOverlay?: (e: React.MouseEvent) => void;
};

const ImageOverlay: React.FC<ImageOverlayProps> = ({
  image,
  name,
  fullscreen,
  showOverlay,
  dragOverlay
}) => {
  const overlay = useContext(OverlayContext);
  const imgRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { startDrag } = useDragScroll(scrollRef);
  const [preventClose, setPreventClose] = useState(false);
  const [tooltipBoxes, setTooltipBoxes] = useState<Array<Bbox>>([]);
  const [minProbability, setMinProbability] = useState<number | undefined>(
    undefined
  );
  const classColourMap = image.classes
    ? assignColours(image.classes)
    : new Map();
  const [classColours, setClassColours] = useState(new Map(classColourMap));
  // A copy map of the Map is created such that React re-renders it, since
  // mutating it won't change the reference and therefore won't trigger
  // a re-render.
  const setNewClassColour = (className: string, colour: Colour) => {
    setClassColours(new Map(classColours.set(className, colour)));
  };
  const [showThumbnail, setShowThumbnail] = useState(
    image.thumbnail !== undefined
  );
  const [imageSize, setImageSize] = useState<ImageSize>({});
  const setSize = (width: number, height: number) => {
    setImageSize({ width, height });
  };
  useEffect(() => {
    const classColourMap = image.classes
      ? assignColours(image.classes)
      : new Map();
    setClassColours(new Map(classColourMap));
  }, [image]);
  useEffect(() => {
    const outsideClick = (e: MouseEvent) => {
      if (preventClose) {
        setPreventClose(false);
      } else if (
        fullscreen &&
        e.button === 0 &&
        imgRef.current &&
        !imgRef.current.contains(e.target as Node)
      ) {
        overlay.hide();
      }
    };
    window.addEventListener("click", outsideClick);
    // Clean up when the component is destroyed
    return () => {
      window.removeEventListener("click", outsideClick);
    };
  });
  const boxes: Array<Bbox> = [];
  // The probability threshold should only be visible when there are actually
  // bounding boxes that have specified a probability.
  let hasProbabilities = false;
  if (image.boxes !== undefined) {
    for (const bbox of image.boxes) {
      if (bbox.probability !== undefined) {
        hasProbabilities = true;
      }
      if (bbox.probability !== undefined) {
        const probToCompare =
          minProbability === undefined ? image.minProbability : minProbability;
        if (probToCompare !== undefined && bbox.probability < probToCompare) {
          continue;
        }
      }
      boxes.push(bbox);
    }
  }
  const updateTooltip = (clientX: number, clientY: number) => {
    if (svgRef.current !== null) {
      const { left, top } = svgRef.current.getBoundingClientRect();
      const x = clientX - left;
      const y = clientY - top;
      setTooltipBoxes(boxesInside(boxes, x, y));
    }
  };
  const hasSidebar =
    !fullscreen && (hasProbabilities || image.classes !== undefined);
  // The image can be too small to display the expand icon inside.
  const imageTooSmall =
    imageSize.width &&
    imageSize.height &&
    imageSize.width < styles.smallImageSize &&
    imageSize.height < styles.smallImageSize;
  return (
    <>
      <div
        className={
          fullscreen
            ? styles.imageOverlayContainerFullscreen
            : styles.imageOverlayContainer
        }
      >
        <div
          className={
            fullscreen ? styles.imageOverlayFullscreen : styles.imageOverlay
          }
          onMouseDown={e => {
            if (fullscreen && dragOverlay) {
              setPreventClose(true);
              dragOverlay(e);
            } else {
              startDrag(e);
            }
          }}
          ref={scrollRef}
        >
          <div
            className={
              fullscreen
                ? styles.imageContainerFullscreen
                : styles.imageContainer
            }
            ref={imgRef}
          >
            <div
              style={
                showThumbnail && image.thumbnail
                  ? {
                      width: image.thumbnail.width,
                      height: image.thumbnail.height
                    }
                  : undefined
              }
            >
              {image.thumbnail && (
                <img
                  src={image.thumbnail.base64}
                  className={
                    showThumbnail ? styles.thumbnail : styles.thumbnailHidden
                  }
                  alt={`thumbnail-${name}`}
                  draggable="false"
                />
              )}
              <img
                src={image.source}
                alt={name}
                draggable="false"
                onLoad={e => {
                  // This is always a HTMLImageElement, obviously.
                  const imgElem = e.target as HTMLImageElement;
                  setSize(imgElem.width, imgElem.height);
                  setShowThumbnail(false);
                }}
              />
            </div>
            {boxes.length > 0 && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox={`0 0 ${imageSize.width || 0} ${imageSize.height || 0}`}
                className={styles.svg}
                onMouseMove={e => updateTooltip(e.clientX, e.clientY)}
                onMouseLeave={() => {
                  setTooltipBoxes([]);
                }}
                ref={svgRef}
              >
                {boxes.map(bbox => (
                  <BoundingBox
                    {...bbox}
                    classColours={classColours}
                    maxWidth={imageSize.width}
                    maxHeight={imageSize.height}
                    key={bboxKey(bbox)}
                  />
                ))}
              </svg>
            )}
          </div>
        </div>
        {!fullscreen && showOverlay !== undefined && (
          <div
            className={imageTooSmall ? styles.expandSmall : styles.expand}
            onClick={() => showOverlay()}
          >
            <ExpandIcon />
          </div>
        )}
      </div>
      {tooltipBoxes.length > 0 && (
        <div className={fullscreen ? undefined : styles.tooltipContainer}>
          <div
            className={
              fullscreen
                ? styles.tooltipBoxListFullscreen
                : styles.tooltipBoxList
            }
          >
            {tooltipBoxes.map(bbox => {
              const classColour = classColours.get(bbox.className);
              return (
                <div
                  className={
                    fullscreen ? styles.tooltipBoxFullscreen : styles.tooltipBox
                  }
                  key={`${bboxKey(bbox)}-tooltip`}
                >
                  {bbox.className && (
                    <div className={styles.tooltipBoxEntry}>
                      <span className={styles.tooltipLabel}>Class:</span>
                      <span
                        className={styles.tooltipValue}
                        style={{
                          color: colourString(classColour || defaultColour)
                        }}
                      >
                        {bbox.className}
                      </span>
                    </div>
                  )}
                  <div className={styles.tooltipBoxEntry}>
                    <span className={styles.tooltipLabel}>x-start:</span>
                    <span className={styles.tooltipValue}>{bbox.xStart}</span>
                  </div>
                  <div className={styles.tooltipBoxEntry}>
                    <span className={styles.tooltipLabel}>x-end:</span>
                    <span className={styles.tooltipValue}>{bbox.xEnd}</span>
                  </div>
                  <div className={styles.tooltipBoxEntry}>
                    <span className={styles.tooltipLabel}>y-start:</span>
                    <span className={styles.tooltipValue}>{bbox.yStart}</span>
                  </div>
                  <div className={styles.tooltipBoxEntry}>
                    <span className={styles.tooltipLabel}>y-end:</span>
                    <span className={styles.tooltipValue}>{bbox.yEnd}</span>
                  </div>
                  {bbox.probability !== undefined && (
                    <div className={styles.tooltipBoxEntry}>
                      <span className={styles.tooltipLabel}>Probability:</span>
                      <span className={styles.tooltipValue}>
                        {roundFloat(bbox.probability, 3)}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {hasSidebar && (
        <div className={styles.sidebar}>
          {image.classes && (
            <ClassList
              classes={image.classes}
              classColours={classColours}
              setClassColour={setNewClassColour}
            />
          )}
          {hasProbabilities && (
            <div className={styles.probability}>
              <span className={styles.probabilityLabel}>
                Probability threshold
              </span>
              <input
                type="number"
                min={0}
                max={1}
                step={0.01}
                placeholder={
                  image.minProbability === undefined
                    ? ""
                    : `Default: ${roundFloat(image.minProbability, 3)}`
                }
                className={styles.probabilityInput}
                value={minProbability === undefined ? "" : minProbability}
                onChange={e => {
                  const prob = stringToFloat(e.target.value);
                  setMinProbability(prob);
                }}
              />
            </div>
          )}
        </div>
      )}
    </>
  );
};

type Props = {
  data: DataMap;
  colours: ColourMap;
  names: Array<string>;
  hideName: (name: string) => void;
};

export const Images: React.FC<Props> = ({ data, colours, names, hideName }) => {
  const kind = "images";
  const dataOfKind = getDataKind(data, kind, names, colours);
  const cards = dataOfKind
    .map(
      d =>
        d.data &&
        Object.keys(d.data).length > 0 && (
          <Card
            name={d.name}
            hideName={hideName}
            colour={d.colour}
            steps={sortedSteps(d.data)}
            key={d.name}
          >
            {selected =>
              sortObject(d.data).map(({ key, value }) => (
                <CategoryCard
                  category={key}
                  contentClass={styles.categoryContent}
                  steps={sortedCategorySteps(value)}
                  selectedStep={selected}
                  key={key}
                >
                  {(
                    selectedCategory,
                    { isOverlay, showOverlay, startDrag }
                  ) => {
                    const selectedValue =
                      selectedCategory !== undefined && value.steps
                        ? value.steps[selectedCategory]
                        : value.global;
                    return (
                      selectedValue && (
                        <DataLoader data={selectedValue}>
                          {loadedData => (
                            <ImageOverlay
                              image={loadedData}
                              name={key}
                              fullscreen={isOverlay}
                              showOverlay={showOverlay}
                              dragOverlay={startDrag}
                            />
                          )}
                        </DataLoader>
                      )
                    );
                  }}
                </CategoryCard>
              ))
            }
          </Card>
        )
    )
    .filter(c => c);
  return cards.length === 0 ? <Empty text={kind} /> : <>{cards}</>;
};
