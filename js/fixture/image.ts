import { DataMap } from "../data";
// This is ignored since TypeScript is not happy with images, but it will
// automatically be bundled.
// @ts-ignore
import birdImage from "./birds-1024.png";
// @ts-ignore
import flippedImage from "./birds-flipped.png";
// @ts-ignore
import greyImage from "./birds-grey.png";

const classes = [
  "bird",
  "a slightly longer class name",
  "orange",
  "An extremely long class name that might wrap or break everything in the layout",
  "cat"
];

export const images: DataMap = new Map([
  [
    "test name",
    {
      images: {
        Birds: {
          steps: {
            1: {
              source: birdImage,
              classes,
              bbox: [
                {
                  xStart: 0,
                  xEnd: 250,
                  yStart: 0,
                  yEnd: 300,
                  className: "bird",
                  probability: 0.2
                },
                {
                  xStart: 500,
                  xEnd: 1024,
                  yStart: 100,
                  yEnd: 682,
                  className: "orange",
                  probability: 0.3
                }
              ]
            },
            2: {
              source: birdImage,
              classes,
              bbox: [
                {
                  xStart: 500,
                  xEnd: 1024,
                  yStart: 100,
                  yEnd: 682,
                  className: "bird",
                  probability: 0.3
                }
              ]
            }
          }
        },
        "Birds Flipped": {
          steps: {
            1: {
              source: flippedImage,
              classes,
              bbox: [
                {
                  xStart: 50,
                  xEnd: 300,
                  yStart: 50,
                  yEnd: 250,
                  className: "bird",
                  probability: 0.9
                },
                {
                  xStart: 100,
                  xEnd: 300,
                  yStart: 500,
                  yEnd: 650,
                  className: "orange",
                  probability: 0.3
                }
              ]
            }
          }
        },
        "Birds Greyscale": {
          steps: {
            1: {
              source: greyImage,
              classes,
              bbox: [
                {
                  xStart: 50,
                  xEnd: 250,
                  yStart: 50,
                  yEnd: 300,
                  className: "bird"
                },
                {
                  xStart: 500,
                  xEnd: 650,
                  yStart: 100,
                  yEnd: 300,
                  className: "orange"
                }
              ]
            }
          }
        }
      }
    }
  ],
  [
    "An extremely long title name that might wrap or break everything in the layout",
    {
      images: {
        Birds: {
          steps: {
            1: {
              source: birdImage,
              classes,
              bbox: [
                {
                  xStart: 150,
                  xEnd: 200,
                  yStart: 150,
                  yEnd: 250,
                  className: "bird",
                  probability: 0.2
                },
                {
                  xStart: 50,
                  xEnd: 500,
                  yStart: 200,
                  yEnd: 400,
                  className: "bird",
                  probability: 0.4
                }
              ]
            },
            2: {
              source: birdImage,
              classes,
              bbox: [
                {
                  xStart: 150,
                  xEnd: 200,
                  yStart: 150,
                  yEnd: 250,
                  className: "bird",
                  probability: 0.2
                },
                {
                  xStart: 50,
                  xEnd: 500,
                  yStart: 200,
                  yEnd: 400,
                  className: "orange",
                  probability: 0.333
                }
              ]
            }
          }
        }
      }
    }
  ],
  [
    "different start",
    {
      images: {
        Birds: {
          steps: {
            1: {
              source: flippedImage
            }
          }
        }
      }
    }
  ]
]);
