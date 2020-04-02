import React, { useEffect, useState } from "react";
import { stringToFloat, stringToInt } from "../number";
import * as styles from "./ColourInput.styles";
import {
  Colour,
  coloursEqual,
  Hsv,
  parseHex,
  toHex,
  toHsl,
  toHsv,
  toRgb,
} from "./definition";

export type InputFormat = "rgb" | "hsl" | "hex";
export const defaultInputFormat = "rgb";

type InputProps = {
  colour: Hsv;
  setColour: (colour: Hsv) => void;
  switchMode: () => void;
};

const RgbInput: React.FC<InputProps> = ({ colour, setColour, switchMode }) => {
  // The input values can have invalid values, which means the colour can't be
  // updated, but the input field needs to updated. Therefore it's in a separate
  // state and the colour is only updated when the values are valid.
  const colourToState = (colour: Hsv) => {
    const rgbColour = toRgb({ kind: "hsv", value: colour }).value;
    const currentAlpha = colour.alpha === undefined ? 1.0 : colour.alpha;
    return {
      red: rgbColour.red.toString(),
      green: rgbColour.green.toString(),
      blue: rgbColour.blue.toString(),
      alpha: currentAlpha.toString(),
    };
  };
  const rgbColour = toRgb({ kind: "hsv", value: colour }).value;
  // The input values can have invalid values, which means the colour can't be
  // updated, but the input field needs to updated. Therefore it's in a separate
  // state and the colour is only updated when the values are valid.
  const [inputValues, setInputValues] = useState(colourToState(colour));
  useEffect(() => {
    setInputValues(colourToState(colour));
  }, [colour]);
  return (
    <div className={styles.inputPanel}>
      <div className={styles.inputField}>
        <input
          type="number"
          className={styles.input}
          min={0}
          max={255}
          value={inputValues.red}
          onChange={(e) => {
            const { value } = e.target;
            // Don't allow more than 3 characters
            if (value.length > 3) {
              return;
            }
            setInputValues({ ...inputValues, red: value });
            const red = stringToInt(value);
            // Only update the colour if it's a valid value.
            if (red !== undefined && red >= 0 && red <= 255) {
              const newColour: Colour = {
                kind: "rgb",
                value: { ...rgbColour, red },
              };
              setColour(toHsv(newColour).value);
            }
          }}
        />
        <span className={styles.label}>R</span>
      </div>
      <div className={styles.inputField}>
        <input
          type="number"
          className={styles.input}
          min={0}
          max={255}
          value={inputValues.green}
          onChange={(e) => {
            const { value } = e.target;
            // Don't allow more than 3 characters
            if (value.length > 3) {
              return;
            }
            setInputValues({ ...inputValues, green: value });
            const green = stringToInt(value);
            // Only update the colour if it's a valid value.
            if (green !== undefined && green >= 0 && green <= 255) {
              const newColour: Colour = {
                kind: "rgb",
                value: { ...rgbColour, green },
              };
              setColour(toHsv(newColour).value);
            }
          }}
        />
        <span className={styles.label}>G</span>
      </div>
      <div className={styles.inputField}>
        <input
          type="number"
          className={styles.input}
          min={0}
          max={255}
          value={inputValues.blue}
          onChange={(e) => {
            const { value } = e.target;
            // Don't allow more than 3 characters
            if (value.length > 3) {
              return;
            }
            setInputValues({ ...inputValues, blue: value });
            const blue = stringToInt(value);
            // Only update the colour if it's a valid value.
            if (blue !== undefined && blue >= 0 && blue <= 255) {
              const newColour: Colour = {
                kind: "rgb",
                value: { ...rgbColour, blue },
              };
              setColour(toHsv(newColour).value);
            }
          }}
        />
        <span className={styles.label}>B</span>
      </div>
      <div className={styles.inputField}>
        <input
          type="number"
          className={styles.input}
          min={0}
          max={1}
          step={0.01}
          value={inputValues.alpha}
          onChange={(e) => {
            const { value } = e.target;
            // Don't allow more than 4 characters
            if (value.length > 4) {
              return;
            }
            setInputValues({ ...inputValues, alpha: value });
            const alpha = stringToFloat(value);
            // Only update the colour if it's a valid value.
            if (alpha !== undefined && alpha >= 0 && alpha <= 1) {
              setColour({ ...colour, alpha });
            }
          }}
        />
        <span className={styles.label}>A</span>
      </div>
      <div className={styles.inputSwitch} onClick={switchMode}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px">
          <path
            fill="#333"
            d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zM12 18.17L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15z"
          />
        </svg>
      </div>
    </div>
  );
};

const HslInput: React.FC<InputProps> = ({ colour, setColour, switchMode }) => {
  const colourToState = (colour: Hsv) => {
    const hslColour = toHsl({ kind: "hsv", value: colour }).value;
    const currentAlpha = colour.alpha === undefined ? 1.0 : colour.alpha;
    return {
      hue: hslColour.hue.toString(),
      saturation: hslColour.saturation.toString(),
      lightness: hslColour.lightness.toString(),
      alpha: currentAlpha.toString(),
    };
  };
  const hslColour = toHsl({ kind: "hsv", value: colour }).value;
  // The input values can have invalid values, which means the colour can't be
  // updated, but the input field needs to updated. Therefore it's in a separate
  // state and the colour is only updated when the values are valid.
  const [inputValues, setInputValues] = useState(colourToState(colour));
  useEffect(() => {
    setInputValues(colourToState(colour));
  }, [colour]);
  return (
    <div className={styles.inputPanel}>
      <div className={styles.inputField}>
        <input
          type="number"
          className={styles.input}
          min={0}
          max={360}
          value={inputValues.hue}
          onChange={(e) => {
            const { value } = e.target;
            // Don't allow more than 3 characters
            if (value.length > 3) {
              return;
            }
            setInputValues({ ...inputValues, hue: value });
            const hue = stringToInt(value);
            // Only update the colour if it's a valid value.
            if (hue !== undefined && hue >= 0 && hue <= 360) {
              // Hue is the same for HSL and HSV
              setColour({ ...colour, hue });
            }
          }}
        />
        <span className={styles.label}>H</span>
      </div>
      <div className={styles.inputField}>
        <input
          type="number"
          className={styles.input}
          min={0}
          max={100}
          value={inputValues.saturation}
          onChange={(e) => {
            const { value } = e.target;
            // Don't allow more than 3 characters
            if (value.length > 3) {
              return;
            }
            setInputValues({ ...inputValues, saturation: value });
            const saturation = stringToInt(value);
            // Only update the colour if it's a valid value.
            if (
              saturation !== undefined &&
              saturation >= 0 &&
              saturation <= 100
            ) {
              const newColour: Colour = {
                kind: "hsl",
                value: { ...hslColour, saturation },
              };
              setColour(toHsv(newColour).value);
            }
          }}
        />
        <span className={styles.label}>S</span>
      </div>
      <div className={styles.inputField}>
        <input
          type="number"
          className={styles.input}
          min={0}
          max={100}
          value={inputValues.lightness}
          onChange={(e) => {
            const { value } = e.target;
            // Don't allow more than 3 characters
            if (value.length > 3) {
              return;
            }
            setInputValues({ ...inputValues, lightness: value });
            const lightness = stringToInt(value);
            // Only update the colour if it's a valid value.
            if (lightness !== undefined && lightness >= 0 && lightness <= 100) {
              const newColour: Colour = {
                kind: "hsl",
                value: { ...hslColour, lightness },
              };
              setColour(toHsv(newColour).value);
            }
          }}
        />
        <span className={styles.label}>L</span>
      </div>
      <div className={styles.inputField}>
        <input
          type="number"
          className={styles.input}
          min={0}
          max={1}
          step={0.01}
          value={inputValues.alpha}
          onChange={(e) => {
            const { value } = e.target;
            // Don't allow more than 4 characters
            if (value.length > 4) {
              return;
            }
            setInputValues({ ...inputValues, alpha: value });
            const alpha = stringToFloat(value);
            // Only update the colour if it's a valid value.
            if (alpha !== undefined && alpha >= 0 && alpha <= 1) {
              setColour({ ...colour, alpha });
            }
          }}
        />
        <span className={styles.label}>A</span>
      </div>
      <div className={styles.inputSwitch} onClick={switchMode}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px">
          <path
            fill="#333"
            d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zM12 18.17L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15z"
          />
        </svg>
      </div>
    </div>
  );
};

const HexInput: React.FC<InputProps> = ({ colour, setColour, switchMode }) => {
  // The input values can have invalid values, which means the colour can't be
  // updated, but the input field needs to updated. Therefore it's in a separate
  // state and the colour is only updated when the values are valid.
  const colourToState = (colour: Hsv) => {
    const hex = toHex({ kind: "hsv", value: colour });
    return hex;
  };
  // The input values can have invalid values, which means the colour can't be
  // updated, but the input field needs to updated. Therefore it's in a separate
  // state and the colour is only updated when the values are valid.
  const [inputValue, setInputValue] = useState(colourToState(colour));
  useEffect(() => {
    const valueColour = parseHex(inputValue);
    // This effect is necessary to update the value of the input field when
    // a new colour is rendered, since it is controlled by the state and
    // overrules the prop.
    // But colours passed as prop are always full Hex strings, and when the user
    // entered a short version, it would get overwritten immediately.
    // That's rather jumpy and therefore it only gets overwritten when the
    // colours are actually different.
    if (
      valueColour === undefined ||
      coloursEqual(valueColour, { kind: "hsv", value: colour })
    ) {
      return;
    }
    setInputValue(colourToState(colour));
  }, [inputValue, colour]);

  return (
    <div className={styles.inputPanel}>
      <div className={styles.inputField}>
        <input
          className={styles.input}
          value={inputValue}
          onChange={(e) => {
            const { value } = e.target;
            // Don't allow more than 9 characters (# + 8 hex values)
            if (value.length > 9) {
              return;
            }
            const rgbColour = parseHex(value);
            setInputValue(value);
            if (rgbColour !== undefined) {
              const newColour = toHsv(rgbColour).value;
              setColour(newColour);
            }
          }}
        />
        <span className={styles.label}>Hex</span>
      </div>
      <div className={styles.inputSwitch} onClick={switchMode}>
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" width="24px">
          <path
            fill="#333"
            d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zM12 18.17L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15z"
          />
        </svg>
      </div>
    </div>
  );
};

type Props = {
  colour: Hsv;
  setColour: (colour: Hsv) => void;
};

export const ColourInput: React.FC<Props> = ({ colour, setColour }) => {
  const [format, setFormat] = useState<InputFormat>(defaultInputFormat);
  switch (format) {
    case "rgb": {
      return (
        <RgbInput
          colour={colour}
          setColour={setColour}
          switchMode={() => setFormat("hsl")}
        />
      );
    }
    case "hsl": {
      return (
        <HslInput
          colour={colour}
          setColour={setColour}
          switchMode={() => setFormat("hex")}
        />
      );
    }
    case "hex": {
      return (
        <HexInput
          colour={colour}
          setColour={setColour}
          switchMode={() => setFormat("rgb")}
        />
      );
    }
  }
};
