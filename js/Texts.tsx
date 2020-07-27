import { diffChars } from "diff";
import React from "react";
import { Card, CategoryCard } from "./Card";
import { ColourMap } from "./colour/definition";
import {
  DataMap,
  getDataKind,
  sortedCategorySteps,
  sortedSteps,
  sortObject,
} from "./data";
import { DataLoader } from "./DataLoader";
import { Empty } from "./Empty";
import * as styles from "./Texts.styles";

export type Text = {
  actual: string;
  expected?: string;
};

type TextProps = {
  actual: string;
  expected?: string;
  categoryFilter?: RegExp;
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
    const identical = actual === expected;
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
              <div className={styles.diffContainer}>
                <div className={styles.columnTextActual}>{diffActual}</div>
                <div className={styles.columnTextExpected}>{diffExpected}</div>
              </div>
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
  names: Array<string>;
  hideName: (name: string) => void;
  categoryFilter?: RegExp;
};

export const Texts: React.FC<Props> = ({
  data,
  colours,
  names,
  hideName,
  categoryFilter,
}) => {
  const kind = "texts";
  const dataOfKind = getDataKind(data, kind, names, colours, categoryFilter);
  const cards = dataOfKind
    .map(
      (d) =>
        d.data &&
        Object.keys(d.data).length > 0 && (
          <Card
            name={d.name}
            hideName={hideName}
            colour={d.colour}
            steps={sortedSteps(d.data)}
            key={d.name}
          >
            {(selected) =>
              sortObject(d.data).map(({ key, value }) => (
                <CategoryCard
                  category={key}
                  steps={sortedCategorySteps(value)}
                  selectedStep={selected}
                  key={key}
                >
                  {(selectedCategory) => {
                    const selectedValue =
                      selectedCategory !== undefined && value.steps
                        ? value.steps[selectedCategory]
                        : value.global;
                    return (
                      selectedValue && (
                        <DataLoader data={selectedValue}>
                          {(loadedData) => (
                            <Text
                              actual={loadedData.actual}
                              expected={loadedData.expected}
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
    .filter((c) => c);
  return cards.length === 0 ? <Empty text={kind} /> : <>{cards}</>;
};
