import React from "react";
import * as styles from "./Content.styles";
import { LineData, LinePlot } from "./plot/LinePlot";

const exampleColours = ["#ff11ff", "#00ff44"];

const exampleSeries: Array<LineData> = [
  {
    name: "series-1",
    data: [
      /* [0, 30], */
      [1, 40],
      [2, 45],
      [3, 50],
      [4, 49],
      [5, 60],
      [6, 70],
      [7, 91]
    ]
  },
  {
    name: "A very long name",
    data: [
      /* [0, 30], */
      [1, 70],
      [2, 45],
      [3, 40],
      [4, 60],
      [5, 49],
      [6, 50],
      [7, undefined]
    ]
  }
];

const exampleSeries2: Array<LineData> = [
  {
    name: "series-1",
    data: [
      [0, 30],
      [1, 40],
      [2, 45],
      [3, 50],
      [4, 49],
      [5, 60],
      [6, 70],
      [7, 91]
    ]
  },
  {
    name: "A very long name",
    data: [
      [0, 30],
      [1, 70],
      [2, 45],
      [3, 40],
      [4, 60],
      [5, 49],
      [6, 50],
      [7, undefined]
    ]
  }
];

export const Content = () => (
  <main className={styles.main}>
    <LinePlot
      data={exampleSeries}
      colours={exampleColours}
      title="Character Error Rate"
    />
    <LinePlot
      data={exampleSeries2}
      colours={exampleColours}
      title="Something else"
    />
    <LinePlot
      data={exampleSeries}
      colours={exampleColours}
      title="An extremely long title that might wrap or break everything in the layout"
    />
  </main>
);
