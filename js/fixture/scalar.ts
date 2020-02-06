import { DataMap } from "../data";

// Some data to test the actual graphs
export const scalars: DataMap = new Map([
  [
    "test name",
    {
      scalars: {
        "Character Error Rate": {
          steps: {
            0: { value: 0.9 },
            1: { value: 0.7 },
            2: { value: 0.7 },
            3: { value: 0.66 },
            4: { value: 0.65 }
          }
        },
        Correct: {
          steps: {
            0: { value: 0.0 },
            1: { value: 0.0 },
            2: { value: 0.0 },
            3: { value: 0.16 },
            4: { value: 0.22 }
          }
        }
      }
    }
  ],
  [
    "An extremely long title name that might wrap or break everything in the layout",
    {
      scalars: {
        "Character Error Rate": {
          steps: {
            0: { value: 0.4 },
            1: { value: 0.44 },
            2: { value: 0.42 },
            3: { value: 0.36 },
            4: { value: 0.35 },
            5: { value: 0.28 }
          }
        },
        Correct: {
          steps: {
            0: { value: 0.4 },
            1: { value: 0.45 },
            2: { value: 0.4 },
            3: { value: 0.46 },
            4: { value: 0.52 },
            5: { value: 0.6 }
          }
        },
        Special: {
          steps: {
            0: { value: 10 },
            1: { value: 20 },
            2: { value: 30 },
            3: { value: 10 },
            4: { value: 30 },
            5: { value: 40 }
          }
        }
      }
    }
  ],
  [
    "different start",
    {
      scalars: {
        "Character Error Rate": {
          steps: {
            2: { value: 0.5 },
            3: { value: 0.54 },
            4: { value: 0.45 }
          }
        },
        Correct: {
          steps: {
            2: { value: 0.0 },
            3: { value: 0.26 },
            4: { value: 0.32 }
          }
        }
      }
    }
  ]
]);
