import { StatMap } from "./Content";

// Some data to test the actual graphs
export const data: StatMap = new Map([
  [
    "test name",
    {
      start: 0,
      stats: {
        "Character Error Rate": [0.9, 0.7, 0.7, 0.66, 0.65],
        Correct: [0.0, 0.0, 0.0, 0.16, 0.22]
      }
    }
  ],
  [
    "An extremely long title name that might wrap or break everything in the layout",
    {
      start: 0,
      stats: {
        "Character Error Rate": [0.4, 0.44, 0.42, 0.36, 0.35, 0.28],
        Correct: [0.4, 0.45, 0.4, 0.46, 0.52, 0.6],
        Special: [10, 20, 30, 10, 30, 40]
      }
    }
  ],
  [
    "different start",
    {
      start: 2,
      stats: {
        "Character Error Rate": [0.5, 0.54, 0.45],
        Correct: [0.0, 0.26, 0.32]
      }
    }
  ]
]);
