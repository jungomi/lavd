import { roundFloat } from "../number";

export type Rgb = {
  red: number;
  green: number;
  blue: number;
  alpha?: number;
};

export type Hsl = {
  hue: number;
  saturation: number;
  lightness: number;
  alpha?: number;
};

export type Hsv = {
  hue: number;
  saturation: number;
  value: number;
  alpha?: number;
};

export type RgbColour = { kind: "rgb"; value: Rgb };
export type HslColour = { kind: "hsl"; value: Hsl };
export type HsvColour = { kind: "hsv"; value: Hsv };

export type Colour = RgbColour | HslColour | HsvColour;

export function colourString(colour: Colour): string {
  const alpha = colour.value.alpha === undefined ? 1.0 : colour.value.alpha;
  if (colour.kind === "rgb") {
    const { red, green, blue } = colour.value;
    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  } else if (colour.kind === "hsl") {
    const { hue, saturation, lightness } = colour.value;
    return `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
  } else if (colour.kind === "hsv") {
    return colourString(toHsl(colour));
  } else {
    throw new Error("Colour format not covered");
  }
}

export function contrastForeground(colour: Colour): Colour {
  const rgbColour = toRgb(colour).value;
  const value =
    (rgbColour.red * 299 + rgbColour.green * 587 + rgbColour.blue * 114) / 1000;
  const fgColour =
    value >= 128
      ? { red: 0, green: 0, blue: 0 }
      : { red: 255, green: 255, blue: 255 };
  return { kind: "rgb", value: fgColour };
}

// Conversion based on
// https://stackoverflow.com/questions/39118528/rgb-to-hsl-conversion
function rgbToHsl(colour: Rgb): Hsl {
  const red = colour.red / 255;
  const green = colour.green / 255;
  const blue = colour.blue / 255;
  const min = Math.min(red, green, blue);
  const max = Math.max(red, green, blue);
  const lightness = (min + max) / 2;
  let hue = 0;
  let saturation = 0;
  if (max !== min) {
    const chroma = max - min;
    saturation = chroma / (1 - Math.abs(2 * lightness - 1));
    switch (max) {
      case red: {
        const segment = (green - blue) / chroma;
        if (segment < 0) {
          hue = segment + 360 / 60;
        } else {
          hue = segment;
        }
        break;
      }
      case green: {
        hue = (blue - red) / chroma + 120 / 60;
        break;
      }
      case blue: {
        hue = (red - green) / chroma + 240 / 60;
        break;
      }
    }
  }
  return {
    hue: Math.round(hue * 60),
    saturation: Math.round(saturation * 100),
    lightness: Math.round(lightness * 100),
    alpha: colour.alpha && roundFloat(colour.alpha),
  };
}

// Basically copied from:
// https://axonflux.com/handy-rgb-to-hsl-and-rgb-to-hsv-color-model-c
// Can't be bothered to rewrite it in a non-cryptic way.
function hueToRgb(p: number, q: number, t: number): number {
  if (t < 0) {
    t += 1;
  }
  if (t > 1) {
    t -= 1;
  }
  if (t < 1 / 6) {
    return p + (q - p) * 6 * t;
  }
  if (t < 1 / 2) {
    return q;
  }
  if (t < 2 / 3) {
    return p + (q - p) * (2 / 3 - t) * 6;
  }
  return p;
}

function hslToRgb(colour: Hsl): Rgb {
  const hue = colour.hue / 360;
  const saturation = colour.saturation / 100;
  const lightness = colour.lightness / 100;
  let red = lightness;
  let green = lightness;
  let blue = lightness;
  if (saturation !== 0) {
    const q =
      lightness < 0.5
        ? lightness * (1 + saturation)
        : lightness + saturation - lightness * saturation;
    const p = 2 * lightness - q;
    red = hueToRgb(p, q, hue + 1 / 3);
    green = hueToRgb(p, q, hue);
    blue = hueToRgb(p, q, hue - 1 / 3);
  }
  return {
    red: Math.round(red * 255),
    green: Math.round(green * 255),
    blue: Math.round(blue * 255),
    alpha: colour.alpha && roundFloat(colour.alpha),
  };
}

function hsvToHsl(colour: Hsv): Hsl {
  const lightness = (colour.value / 2) * (2 - colour.saturation / 100);
  let saturation = 0;
  if (lightness > 0 && lightness < 100) {
    if (lightness < 50) {
      saturation = (colour.saturation * colour.value) / (lightness * 2);
    } else {
      saturation = (colour.saturation * colour.value) / ((100 - lightness) * 2);
    }
  }
  return {
    hue: Math.round(colour.hue),
    saturation: Math.round(saturation),
    lightness: Math.round(lightness),
    alpha: colour.alpha && roundFloat(colour.alpha),
  };
}

function hslToHsv(colour: Hsl): Hsv {
  const temp =
    (colour.saturation * Math.min(colour.lightness, 100 - colour.lightness)) /
    100;
  const divisor = colour.lightness + temp;
  const saturation = divisor === 0 ? 0 : (200 * temp) / divisor;
  const value = colour.lightness + temp;
  return {
    hue: Math.round(colour.hue),
    saturation: Math.round(saturation),
    value: Math.round(value),
    alpha: colour.alpha && roundFloat(colour.alpha),
  };
}

export function toRgb(colour: Colour): RgbColour {
  if (colour.kind === "rgb") {
    return colour;
  } else if (colour.kind === "hsl") {
    return { kind: "rgb", value: hslToRgb(colour.value) };
  } else if (colour.kind === "hsv") {
    return { kind: "rgb", value: hslToRgb(hsvToHsl(colour.value)) };
  } else {
    throw new Error("Colour format not covered");
  }
}

export function toHsl(colour: Colour): HslColour {
  if (colour.kind === "rgb") {
    return { kind: "hsl", value: rgbToHsl(colour.value) };
  } else if (colour.kind === "hsl") {
    return colour;
  } else if (colour.kind === "hsv") {
    return { kind: "hsl", value: hsvToHsl(colour.value) };
  } else {
    throw new Error("Colour format not covered");
  }
}

export function toHsv(colour: Colour): HsvColour {
  if (colour.kind === "rgb") {
    return { kind: "hsv", value: hslToHsv(rgbToHsl(colour.value)) };
  } else if (colour.kind === "hsl") {
    return { kind: "hsv", value: hslToHsv(colour.value) };
  } else if (colour.kind === "hsv") {
    return colour;
  } else {
    throw new Error("Colour format not covered");
  }
}

export function toHex(colour: Colour): string {
  const rgbColour = toRgb(colour).value;
  const red = rgbColour.red.toString(16).padStart(2, "0");
  const green = rgbColour.green.toString(16).padStart(2, "0");
  const blue = rgbColour.blue.toString(16).padStart(2, "0");
  const currentAlpha = rgbColour.alpha === undefined ? 1.0 : rgbColour.alpha;
  const alpha =
    currentAlpha === 1.0
      ? ""
      : Math.round(currentAlpha * 255)
          .toString(16)
          .padStart(2, "0");
  return `#${red}${green}${blue}${alpha}`;
}

export function parseHex(str: string): RgbColour | undefined {
  let hexString = str.replace("#", "");
  // Short version of hex (with optional alpha) where it the value is just
  // repeated once.
  if (hexString.length === 3 || hexString.length === 4) {
    hexString = [...hexString].map((s) => s.repeat(2)).join("");
  }
  // Not a valid hex colour
  if (hexString.length !== 6 && hexString.length !== 8) {
    return undefined;
  }
  // Incorrect characters
  if (!/^[0-9a-f]+$/.test(hexString)) {
    return undefined;
  }
  const hex = Number.parseInt(hexString, 16);
  if (Number.isNaN(hex)) {
    return undefined;
  }
  const hasAlpha = hexString.length === 8;
  if (hasAlpha) {
    const red = (hex >> 24) & 255;
    const green = (hex >> 16) & 255;
    const blue = (hex >> 8) & 255;
    const alpha = (hex & 255) / 255;
    return { kind: "rgb", value: { red, green, blue, alpha } };
  } else {
    const red = (hex >> 16) & 255;
    const green = (hex >> 8) & 255;
    const blue = hex & 255;
    return { kind: "rgb", value: { red, green, blue } };
  }
}

export function coloursEqual(colour1: Colour, colour2: Colour): boolean {
  const hsl1 = toHsl(colour1).value;
  const hsl2 = toHsl(colour2).value;
  const alpha1 = hsl1.alpha === undefined ? 1.0 : hsl1.alpha;
  const alpha2 = hsl2.alpha === undefined ? 1.0 : hsl2.alpha;
  return (
    hsl1.hue === hsl2.hue &&
    hsl1.saturation === hsl2.saturation &&
    hsl1.lightness === hsl2.lightness &&
    alpha1 === alpha2
  );
}

// Kelly's distinct colours
// Removed some that were too similar.
export const distinctColours: Array<Colour> = [
  { kind: "rgb", value: { red: 255, green: 179, blue: 0 } }, // vivid_yellow
  { kind: "rgb", value: { red: 128, green: 62, blue: 117 } }, // strong_purple
  { kind: "rgb", value: { red: 255, green: 104, blue: 0 } }, // vivid_orange
  { kind: "rgb", value: { red: 166, green: 189, blue: 215 } }, // very_light_blue
  { kind: "rgb", value: { red: 193, green: 0, blue: 32 } }, // vivid_red
  { kind: "rgb", value: { red: 206, green: 162, blue: 98 } }, // grayish_yellow
  { kind: "rgb", value: { red: 129, green: 112, blue: 102 } }, // medium_gray
  { kind: "rgb", value: { red: 0, green: 125, blue: 52 } }, // vivid_green
  { kind: "rgb", value: { red: 246, green: 118, blue: 142 } }, // strong_purplish_pink
  { kind: "rgb", value: { red: 0, green: 83, blue: 138 } }, // strong_blue
  // { kind: "rgb", value: {red: 255, green: 122, blue: 92} },// strong_yellowish_pink
  { kind: "rgb", value: { red: 83, green: 55, blue: 122 } }, // strong_violet
  // { kind: "rgb", value: {red: 255, green: 142, blue: 0} },// vivid_orange_yellow
  { kind: "rgb", value: { red: 179, green: 40, blue: 81 } }, // strong_purplish_red
  { kind: "rgb", value: { red: 244, green: 200, blue: 0 } }, // vivid_greenish_yellow
  { kind: "rgb", value: { red: 127, green: 24, blue: 13 } }, // strong_reddish_brown
  { kind: "rgb", value: { red: 147, green: 170, blue: 0 } }, // vivid_yellowish_green
  { kind: "rgb", value: { red: 89, green: 51, blue: 21 } }, // deep_yellowish_brown
  { kind: "rgb", value: { red: 241, green: 58, blue: 19 } }, // vivid_reddish_orange
  { kind: "rgb", value: { red: 35, green: 44, blue: 22 } }, // dark_olive_green
];

export const defaultColour: Colour = {
  kind: "rgb",
  value: { red: 241, green: 58, blue: 19 },
};

export type ColourMap = Map<string, Colour>;

export function assignColours(data: Array<string>): ColourMap {
  const colourMap = new Map();
  let i = 0;
  for (const name of data) {
    colourMap.set(name, distinctColours[i % distinctColours.length]);
    i += 1;
  }
  return colourMap;
}

export function getDistinctColour(i: number): Colour {
  return distinctColours[i % distinctColours.length];
}
