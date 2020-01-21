import { DataMap } from "../data";

export const texts: DataMap = new Map([
  [
    "test name",
    {
      texts: {
        Countries: {
          steps: {
            1: { actual: "S", expected: "Switzerland" },
            2: { actual: "Swand", expected: "Switzerland" },
            3: { actual: "ze and", expected: "Switzerland" },
            4: { actual: "Swizlunda", expected: "Switzerland" },
            5: { actual: "Swaziland", expected: "Switzerland" },
            6: { actual: "Swizland", expected: "Switzerland" },
            7: { actual: "Switzerland", expected: "Switzerland" }
          }
        },
        Dates: {
          steps: {
            1: { actual: "2222", expected: "22.02.2020" }
          }
        },
        "Some thing random": {
          steps: {
            1: { actual: "asdf", expected: "asdf" }
          }
        },
        "long text": {
          steps: {
            1: {
              actual:
                "An extremely long text that might wrap or break everything in the layout",
              expected:
                "An extremely long text that might wrap or break everything in the layout, hopefully not"
            }
          }
        }
      }
    }
  ],
  [
    "An extremely long title name that might wrap or break everything in the layout",
    {
      texts: {
        Countries: {
          global: { actual: "japn", expected: "Japan" }
        },
        Dates: {
          global: { actual: "22/02/2020", expected: "22.02.2020" }
        },
        "Some thing random": {
          global: { actual: "   klpj nm e ", expected: "klpj bef e" }
        }
      }
    }
  ],
  [
    "different start",
    {
      texts: {
        "Some thing random": {
          steps: {
            3: { actual: "no expected" }
          }
        }
      }
    }
  ]
]);
