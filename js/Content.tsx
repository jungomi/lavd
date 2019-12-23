import React from "react";
import * as styles from "./Content.styles";
import { LinePlot } from "./plot/LinePlot";

type Optional<T> = T | undefined;

export type Stat = {
  start: number;
  stats: {
    [name: string]: Optional<Array<number>>;
  };
};

export type StatMap = Map<string, Stat>;

function sortedCategories(data: StatMap): Array<string> {
  const uniqueCategories: Set<string> = new Set();
  for (const d of data.values()) {
    for (const key of Object.keys(d.stats)) {
      uniqueCategories.add(key);
    }
  }
  return Array.from(uniqueCategories).sort();
}

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
  data: StatMap,
  colourMap: Map<string, string>
) {
  const colours = [];
  const series = [];
  for (const [name, d] of data) {
    const stat = d.stats[category];
    const colour = colourMap.get(name);
    if (stat === undefined || stat.length === 0 || colour === undefined) {
      continue;
    }
    colours.push(colour);
    const enumeratedSeries = stat.map((x, i) => [i + d.start, x]);
    series.push({ name, data: enumeratedSeries });
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
      colours={colours}
      title={category}
    />
  );
}

type Props = {
  data: StatMap;
  colours: Map<string, string>;
};

export const Content: React.FC<Props> = ({ data, colours }) => {
  const categories = sortedCategories(data);
  return (
    <main className={styles.main}>
      {categories.map(category => createPlot(category, data, colours))}
    </main>
  );
};
