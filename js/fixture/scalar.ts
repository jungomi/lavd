import { DataMap } from "../data";

// Some data to test the actual graphs
export const scalars: DataMap = new Map([
  [
    "test name",
    {
      scalars: {
        "Character Error Rate": {
          start: 0,
          values: [0.9, 0.7, 0.7, 0.66, 0.65]
        },
        Correct: {
          start: 0,
          values: [0.0, 0.0, 0.0, 0.16, 0.22]
        }
      }
    }
  ],
  [
    "An extremely long title name that might wrap or break everything in the layout",
    {
      scalars: {
        "Character Error Rate": {
          start: 0,
          values: [0.4, 0.44, 0.42, 0.36, 0.35, 0.28]
        },
        Correct: {
          start: 0,
          values: [0.4, 0.45, 0.4, 0.46, 0.52, 0.6]
        },
        Special: {
          start: 0,
          values: [10, 20, 30, 10, 30, 40]
        }
      }
    }
  ],
  [
    "different start",
    {
      scalars: {
        "Character Error Rate": {
          start: 2,
          values: [0.5, 0.54, 0.45]
        },
        Correct: {
          start: 2,
          values: [0.0, 0.26, 0.32]
        }
      }
    }
  ]
]);
