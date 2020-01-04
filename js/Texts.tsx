import { diffChars } from "diff";
import React from "react";
import { Colour, ColourMap, colourString } from "./colour/definition";
import * as imageStyles from "./Images.styles";
import * as styles from "./Texts.styles";

type Optional<T> = T | undefined;

export type Text = {
  actual: string;
  expected?: string;
};

export type Texts = {
  texts: {
    [name: string]: Optional<Text>;
  };
};
export type TextMap = Map<string, Texts>;

function sortedCategories(data: TextMap): Array<string> {
  const uniqueCategories: Set<string> = new Set();
  for (const d of data.values()) {
    for (const key of Object.keys(d.texts)) {
      uniqueCategories.add(key);
    }
  }
  return Array.from(uniqueCategories).sort();
}

type TextProps = {
  actual: string;
  expected?: string;
};

export const Text: React.FC<TextProps> = ({ actual, expected }) => {
  const diffActual = [];
  const diffExpected = [];
  if (expected === undefined) {
    return (
      <div className={styles.text}>
        <span className={styles.columnText}>{actual}</span>
      </div>
    );
  } else {
    const changes = diffChars(actual, expected);
    // Only one entry in the change list means they are equal.
    const identical = changes.length === 1;
    if (!identical) {
      for (const change of changes) {
        if (change.removed) {
          diffActual.push(
            <span
              className={styles.diffRemoved}
              key={`actual-removed-${change.value}-pos${diffActual.length}`}
            >
              {change.value}
            </span>
          );
        } else if (change.added) {
          diffExpected.push(
            <span
              className={styles.diffAdded}
              key={`expected-added-${change.value}-pos${diffActual.length}`}
            >
              {change.value}
            </span>
          );
        } else {
          diffActual.push(
            <span key={`actual-${change.value}-pos${diffActual.length}`}>
              {change.value}
            </span>
          );
          diffExpected.push(
            <span key={`actual-${change.value}-pos${diffActual.length}`}>
              {change.value}
            </span>
          );
        }
      }
    }
    return (
      <div className={styles.text}>
        <div className={styles.column}>
          <span className={styles.columnTitle}>Actual</span>
          <span className={styles.columnText}>{actual}</span>
        </div>
        <div className={styles.column}>
          <span className={styles.columnTitle}>Expected</span>
          <span className={styles.columnText}>{expected}</span>
        </div>
        <div className={styles.column}>
          <span className={styles.columnTitle}>Diff</span>
          {!identical && (
            <div className={styles.columnDiff}>
              <div className={styles.columnTextActual}>{diffActual}</div>
              <div className={styles.columnText}>{diffExpected}</div>
            </div>
          )}
        </div>
      </div>
    );
  }
};

type TextCardProps = {
  category: string;
  name: string;
  text: Text;
  colour: Colour;
};

const TextCard: React.FC<TextCardProps> = ({
  category,
  name,
  text,
  colour
}) => {
  return (
    <div className={imageStyles.imageCard}>
      <div className={imageStyles.title}>
        <span className={imageStyles.category}>{category}</span>
        <span
          className={imageStyles.name}
          style={{ color: colourString(colour) }}
        >
          {name}
        </span>
      </div>
      <Text actual={text.actual} expected={text.expected} />
    </div>
  );
};

type TextCategoryProps = {
  category: string;
  data: TextMap;
  colourMap: ColourMap;
};

const TextCategory: React.FC<TextCategoryProps> = ({
  category,
  data,
  colourMap
}) => {
  const textCards = [];
  for (const [name, d] of data) {
    const text = d.texts[category];
    const colour = colourMap.get(name);
    if (text === undefined || colour === undefined) {
      continue;
    }
    textCards.push(
      <TextCard
        category={category}
        name={name}
        text={text}
        colour={colour}
        key={`${category}-${name}`}
      />
    );
  }
  return <>{textCards}</>;
};

type Props = {
  data: TextMap;
  colours: ColourMap;
};

export const Texts: React.FC<Props> = ({ data, colours }) => {
  const categories = sortedCategories(data);
  return (
    <>
      {categories.map(category => (
        <TextCategory
          category={category}
          data={data}
          colourMap={colours}
          key={category}
        />
      ))}
    </>
  );
};
