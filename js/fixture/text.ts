import { TextMap } from "../Texts";

export const texts: TextMap = new Map([
  [
    "test name",
    {
      texts: {
        Countries: { actual: "Swizlunda", expected: "Switzerland" },
        Dates: { actual: "2222", expected: "22.02.2020" },
        "Some thing random": { actual: "asdf", expected: "asdf" },
        "long text": {
          actual:
            "An extremely long text that might wrap or break everything in the layout",
          expected:
            "An extremely long text that might wrap or break everything in the layout, hopefully not"
        }
      }
    }
  ],
  [
    "An extremely long title name that might wrap or break everything in the layout",
    {
      texts: {
        Countries: { actual: "japn", expected: "Japan" },
        Dates: { actual: "22/02/2020", expected: "22.02.2020" },
        "Some thing random": { actual: "   klpj nm e ", expected: "klpj bef e" }
      }
    }
  ],
  [
    "different start",
    {
      texts: {
        "Some thing random": { actual: "no expected" }
      }
    }
  ]
]);
