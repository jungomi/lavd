import React from "react";
import { ColourMap, colourString, toRgb } from "./colour/definition";
import {
  CategoryDataEntry,
  DataMap,
  nonEmptyCategoryData,
  Optional,
  sortedCategories
} from "./data";
import { Empty } from "./Empty";
import { LinePlot } from "./plot/LinePlot";

export type Scalars = {
  start: number;
  values: Optional<Array<number>>;
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

function createPlot(
  category: string,
  categoryData: Array<CategoryDataEntry<"scalars">>
) {
  const colours = [];
  const series = [];
  for (const d of categoryData) {
    const stat = d.data.values;
    if (stat === undefined || stat.length === 0) {
      continue;
    }
    colours.push(d.colour);
    const enumeratedSeries = stat.map((x, i) => [i + d.data.start, x]);
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
};

export const Scalars: React.FC<Props> = ({ data, colours }) => {
  const kind = "scalars";
  const categories = sortedCategories(data, kind);
  const plots = categories.map(category =>
    createPlot(category, nonEmptyCategoryData(data, kind, category, colours))
  );
  return plots.length === 0 ? <Empty text={kind} /> : <>{plots}</>;
};
