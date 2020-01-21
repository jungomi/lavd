import React, { useRef, useState } from "react";
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
import { Empty } from "./Empty";
import * as styles from "./Images.styles";
import { stringToFloat } from "./number";

export type Bbox = {
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
  className: string;
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

export type Image = {
  source: string;
  classes?: Array<string>;
  bbox?: Array<Bbox>;
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
  className: string;
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
  const colour: Colour = classColours.get(className) || defaultColour;
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
  border: number = styles.strokeWidth
): Array<Bbox> {
  return boxes.filter(
    box =>
      box.xStart - border <= x &&
      box.xEnd + border >= x &&
      box.yStart - border <= y &&
      box.yEnd + border >= y
  );
}

type ImageSize = {
  width?: number;
  height?: number;
};

type ImageOverlayProps = {
  image: Image;
  name: string;
};

const ImageOverlay: React.FC<ImageOverlayProps> = ({ image, name }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [tooltipBoxes, setTooltipBoxes] = useState<Array<Bbox>>([]);
  const [minProbability, setMinProbability] = useState(
    image ? image.minProbability : undefined
  );
  const classColourMap =
    image && image.classes ? assignColours(image.classes) : new Map();
  const [classColours, setClassColours] = useState(new Map(classColourMap));
  // A copy map of the Map is created such that React re-renders it, since
  // mutating it won't change the reference and therefore won't trigger
  // a re-render.
  const setNewClassColour = (className: string, colour: Colour) => {
    setClassColours(new Map(classColours.set(className, colour)));
  };
  const [imageSize, setImageSize] = useState<ImageSize>({});
  const setSize = (width: number, height: number) => {
    setImageSize({ width, height });
  };
  if (image === undefined) {
    return null;
  }
  const boxes: Array<Bbox> = [];
  // The probability threshold should only be visible when there are actually
  // bounding boxes that have specified a probability.
  let hasProbabilities = false;
  if (image.bbox !== undefined) {
    for (const bbox of image.bbox) {
      if (bbox.probability !== undefined) {
        hasProbabilities = true;
      }
      if (
        minProbability !== undefined &&
        bbox.probability !== undefined &&
        bbox.probability < minProbability
      ) {
        continue;
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
  const hasSidebar = hasProbabilities || image.classes !== undefined;
  return (
    <>
      <div className={styles.imageOverlayContainer}>
        <div className={styles.imageOverlay}>
          <img
            src={image.source}
            alt={name}
            draggable="false"
            onLoad={e => {
              // This is always a HTMLImageElement, obviously.
              const imgElem = e.target as HTMLImageElement;
              setSize(imgElem.width, imgElem.height);
            }}
          />
          {boxes && (
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
                className={styles.probabilityInput}
                value={minProbability === undefined ? "" : minProbability}
                onChange={e => {
                  const prob = stringToFloat(e.target.value);
                  setMinProbability(prob);
                }}
              />
            </div>
          )}
          {tooltipBoxes.length > 0 && (
            <div className={styles.tooltipBoxList}>
              {tooltipBoxes.map(bbox => {
                const classColour = classColours.get(bbox.className);
                return (
                  <div
                    className={styles.tooltipBox}
                    key={`${bboxKey(bbox)}-tooltip`}
                  >
                    <div className={styles.tooltipBoxEntry}>
                      <span className={styles.tooltipLabel}>Class:</span>
                      <span
                        className={styles.tooltipValue}
                        style={{
                          color: classColour && colourString(classColour)
                        }}
                      >
                        {bbox.className}
                      </span>
                    </div>
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
                        <span className={styles.tooltipLabel}>
                          Probability:
                        </span>
                        <span className={styles.tooltipValue}>
                          {bbox.probability}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
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
};

export const Images: React.FC<Props> = ({ data, colours, names }) => {
  const kind = "images";
  const dataOfKind = getDataKind(data, kind, names, colours);
  const cards = dataOfKind.map(
    d =>
      d.data &&
      Object.keys(d.data).length && (
        <Card
          name={d.name}
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
                {selectedCategory => {
                  const selectedValue =
                    selectedCategory && value.steps
                      ? value.steps[selectedCategory]
                      : value.global;
                  return (
                    selectedValue && (
                      <ImageOverlay image={selectedValue} name={key} />
                    )
                  );
                }}
              </CategoryCard>
            ))
          }
        </Card>
      )
  );
  return cards.length === 0 ? <Empty text={kind} /> : <>{cards}</>;
};
