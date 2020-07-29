import React from "react";
import { CategoryCard } from "./Card";
import { ColourMap, toRgb } from "./colour/definition";
import {
  aggregateSortedCategories,
  DataMap,
  nonEmptyScalars,
  Optional,
  ScalarEntry,
} from "./data";
import { Empty } from "./Empty";
import { LineData, LinePlot } from "./plot/LinePlot";

export type Scalar = {
  value: Optional<number>;
};

function buildSeries(categoryData: Array<ScalarEntry>): Array<LineData> {
  const series = [];
  for (const d of categoryData) {
    const steps = d.steps;
    if (steps === undefined) {
      continue;
    }
    const points = [];
    const sortedSteps = Object.keys(steps)
      .map((s) => Number.parseInt(s))
      .sort((a, b) => a - b);
    for (const i of sortedSteps) {
      const step = steps[i];
      if (step === undefined || step.value === undefined) {
        continue;
      }
      points.push({ x: i, y: step.value });
    }
    if (points.length === 0) {
      continue;
    }
    series.push({ name: d.name, colour: toRgb(d.colour), points });
  }
  return series;
}

type Props = {
  data: DataMap;
  colours: ColourMap;
  names: Array<string>;
  categoryFilter?: RegExp;
};

export const Scalars: React.FC<Props> = ({
  data,
  colours,
  names,
  categoryFilter,
}) => {
  const kind = "scalars";
  const categories = aggregateSortedCategories(
    data,
    kind,
    names,
    categoryFilter
  );
  const cards = categories.map((category) => {
    const scalars = nonEmptyScalars(data, category, names, colours);
    return (
      <CategoryCard category={category} key={category}>
        {() => <LinePlot data={buildSeries(scalars)} colours={colours} />}
      </CategoryCard>
    );
  });
  return cards.length === 0 ? (
    <Empty
      text={`${kind} ${
        categoryFilter === undefined ? "available" : "matching filter"
      }`}
    />
  ) : (
    <>{cards}</>
  );
};
