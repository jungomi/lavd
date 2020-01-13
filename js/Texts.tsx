import { diffChars } from "diff";
import React from "react";
import { Card } from "./Card";
import { ColourMap } from "./colour/definition";
import { DataMap, nonEmptyCategoryData, sortedCategories } from "./data";
import { Empty } from "./Empty";
import * as styles from "./Texts.styles";

export type Text = {
  actual: string;
  expected?: string;
};

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
              <div className={styles.columnTextExpected}>{diffExpected}</div>
            </div>
          )}
        </div>
      </div>
    );
  }
};

type Props = {
  data: DataMap;
  colours: ColourMap;
};

export const Texts: React.FC<Props> = ({ data, colours }) => {
  const kind = "texts";
  const categories = sortedCategories(data, kind);
  const cards = categories.map(category =>
    nonEmptyCategoryData(data, kind, category, colours).map(d => (
      <Card
        category={category}
        name={d.name}
        colour={d.colour}
        className={styles.textCard}
        key={`${category}-${d.name}`}
      >
        <Text actual={d.data.actual} expected={d.data.expected} />
      </Card>
    ))
  );
  return cards.length === 0 ? <Empty text={kind} /> : <>{cards}</>;
};
