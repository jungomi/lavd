import React, { useState } from "react";
import { ColourPicker } from "./colour/ColourPicker";
import {
  assignColours,
  Colour,
  ColourMap,
  colourString,
  defaultColour
} from "./colour/definition";
import * as styles from "./Images.styles";

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
};

type Optional<T> = T | undefined;

export type Images = {
  images: {
    [name: string]: Optional<Image>;
  };
};
export type ImageMap = Map<string, Images>;

function sortedCategories(data: ImageMap): Array<string> {
  const uniqueCategories: Set<string> = new Set();
  for (const d of data.values()) {
    for (const key of Object.keys(d.images)) {
      uniqueCategories.add(key);
    }
  }
  return Array.from(uniqueCategories).sort();
}

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
  probability,
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

type ImageOverlayProps = {
  image: Image;
  name: string;
  classColours: ColourMap;
  setClassColour: (className: string, colour: Colour) => void;
  setSize: (width: number, height: number) => void;
  width?: number;
  height?: number;
};

const ImageOverlay: React.FC<ImageOverlayProps> = ({
  image,
  name,
  classColours,
  setClassColour,
  setSize,
  width,
  height
}) => {
  return (
    <div className={styles.imageOverlay}>
      <img
        src={image.source}
        alt={name}
        className={styles.image}
        draggable="false"
        onLoad={e => {
          // This is always a HTMLImageElement, obviously.
          const imgElem = e.target as HTMLImageElement;
          setSize(imgElem.width, imgElem.height);
        }}
      />
      {image.classes && (
        <ClassList
          classes={image.classes}
          classColours={classColours}
          setClassColour={setClassColour}
        />
      )}
      {image.bbox && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={styles.svg}
          style={{ width, height }}
        >
          {image.bbox.map(bbox => (
            <BoundingBox
              {...bbox}
              classColours={classColours}
              maxWidth={width}
              maxHeight={height}
              key={bboxKey(bbox)}
            />
          ))}
        </svg>
      )}
    </div>
  );
};

type ImageSize = {
  width?: number;
  height?: number;
};

type ImageCardProps = {
  category: string;
  name: string;
  image: Image;
  colour: Colour;
};

const ImageCard: React.FC<ImageCardProps> = ({
  category,
  name,
  image,
  colour
}) => {
  const classColourMap =
    image.classes === undefined ? new Map() : assignColours(image.classes);
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
  return (
    <div className={styles.imageCard}>
      <div
        className={styles.title}
        style={{ maxWidth: imageSize.width, maxHeight: imageSize.height }}
      >
        <span className={styles.category}>{category}</span>
        <span className={styles.name} style={{ color: colourString(colour) }}>
          {name}
        </span>
      </div>
      <ImageOverlay
        image={image}
        name={category}
        classColours={classColours}
        setClassColour={setNewClassColour}
        setSize={setSize}
        width={imageSize.width}
        height={imageSize.height}
      />
    </div>
  );
};

type ImageCategoryProps = {
  category: string;
  data: ImageMap;
  colourMap: ColourMap;
};

const ImageCategory: React.FC<ImageCategoryProps> = ({
  category,
  data,
  colourMap
}) => {
  const imageCards = [];
  for (const [name, d] of data) {
    const image = d.images[category];
    const colour = colourMap.get(name);
    if (image === undefined || colour === undefined) {
      continue;
    }
    imageCards.push(
      <ImageCard
        category={category}
        name={name}
        image={image}
        colour={colour}
        key={`${category}-${name}`}
      />
    );
  }
  return <>{imageCards}</>;
};

type Props = {
  data: ImageMap;
  colours: ColourMap;
};

export const Images: React.FC<Props> = ({ data, colours }) => {
  const categories = sortedCategories(data);
  return (
    <div className={styles.container}>
      {categories.map(category => (
        <ImageCategory
          category={category}
          data={data}
          colourMap={colours}
          key={category}
        />
      ))}
    </div>
  );
};
