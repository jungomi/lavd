import React from "react";
import { ColourMap, colourString } from "./colour/definition";
import * as styles from "./Images.styles";

export type Bbox = {
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
  class: string;
  probability?: number;
};

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

function renderImages(category: string, data: ImageMap, colourMap: ColourMap) {
  const items = [];
  for (const [name, d] of data) {
    const image = d.images[category];
    const colour = colourMap.get(name);
    if (image === undefined || colour === undefined) {
      continue;
    }
    items.push({ name, image, colour });
  }
  return items.map(item => (
    <div className={styles.imageCard} key={`${category}-${item.name}`}>
      <div className={styles.title}>
        <span className={styles.category}>{category}</span>
        <span
          className={styles.name}
          style={{ color: colourString(item.colour) }}
        >
          {item.name}
        </span>
      </div>
      <img src={item.image.source} alt={category} className={styles.image} />
    </div>
  ));
}

type Props = {
  data: ImageMap;
  colours: ColourMap;
};

export const Images: React.FC<Props> = ({ data, colours }) => {
  const categories = sortedCategories(data);
  return (
    <div className={styles.container}>
      {categories.map(category => renderImages(category, data, colours))}
    </div>
  );
};
