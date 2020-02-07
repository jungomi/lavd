import { css } from "emotion";
import React from "react";
import { ColourMap, colourString, toRgb } from "./colour/definition";
import {
  aggregateSortedCategories,
  DataMap,
  nonEmptyScalars,
  Optional,
  ScalarEntry
} from "./data";
import { Empty } from "./Empty";
import { LinePlot } from "./plot/LinePlot";

const plotsClass = css({ display: "flex", flexWrap: "wrap" });

export type Scalar = {
  value: Optional<number>;
};

// When the series do not cover the same range (x values) the tooltip will be
// restricted to closest single line, even when there are multiple ones at the
// given step. To get around that they are padded with nulls.
function padSeries(
  series: Array<Array<number>>,
  min: number,
  max: number
): Array<Array<number | null>> {
  const start = series[0][0];
  const end = series[series.length - 1][0];
  const padStart = [];
  const padEnd = [];
  for (let i = min; i < start; i++) {
    padStart.push([i, null]);
  }
  for (let i = end + 1; i <= max; i++) {
    padEnd.push([i, null]);
  }
  return [...padStart, ...series, ...padEnd];
}

function createPlot(category: string, categoryData: Array<ScalarEntry>) {
  const colours = [];
  const series = [];
  for (const d of categoryData) {
    const steps = d.steps;
    if (steps === undefined) {
      continue;
    }
    const enumeratedSeries = [];
    const sortedSteps = Object.keys(steps)
      .map(s => Number.parseInt(s))
      .sort((a, b) => a - b);
    for (const i of sortedSteps) {
      const step = steps[i];
      if (step === undefined || step.value === undefined) {
        continue;
      }
      enumeratedSeries.push([i, step.value]);
    }
    if (enumeratedSeries.length === 0) {
      continue;
    }
    colours.push(d.colour);
    series.push({ name: d.name, data: enumeratedSeries });
  }
  const min = Math.min(...series.map(s => s.data[0][0]));
  const max = Math.max(...series.map(s => s.data[s.data.length - 1][0]));
  const paddedSeries = series.map(s => ({
    ...s,
    data: padSeries(s.data, min, max)
  }));
  return (
    <LinePlot
      key={category}
      data={paddedSeries}
      colours={colours.map(toRgb).map(colourString)}
      title={category}
    />
  );
}

type Props = {
  data: DataMap;
  colours: ColourMap;
  names: Array<string>;
};

export const Scalars: React.FC<Props> = ({ data, colours, names }) => {
  const kind = "scalars";
  const categories = aggregateSortedCategories(data, kind, names);
  const plots = categories.map(category =>
    createPlot(category, nonEmptyScalars(data, category, names, colours))
  );
  return plots.length === 0 ? (
    <Empty text={kind} />
  ) : (
    <div className={plotsClass}>{plots}</div>
  );
};
