import React, { useEffect, useState } from "react";
import * as styles from "./ColourInput.styles";
import {
  Colour,
  coloursEqual,
  Hsl,
  parseHex,
  toHex,
  toHsl,
  toRgb
} from "./definition";

// Round a float to two decimal places
function roundFloat(x: number, precision: number = 2): number {
  const factor = 10 ** precision;
  return Math.round(x * factor) / factor;
}

export type InputFormat = "rgb" | "hsl" | "hex";
export const defaultInputFormat = "rgb";

type InputProps = {
  colour: Hsl;
  setColour: (colour: Hsl) => void;
  switchMode: () => void;
};

const RgbInput: React.FC<InputProps> = ({ colour, setColour, switchMode }) => {
  const rgbColour = toRgb({ kind: "hsl", value: colour }).value;
  const currentAlpha = rgbColour.alpha === undefined ? 1.0 : rgbColour.alpha;
  return (
    <div className={styles.inputPanel}>
      <div className={styles.inputField}>
        <input
          type="number"
          className={styles.input}
          min={0}
          max={255}
          value={rgbColour.red}
          onChange={e => {
            const red = Number.parseInt(e.target.value);
            const newColour: Colour = {
              kind: "rgb",
              value: { ...rgbColour, red }
            };
            setColour(toHsl(newColour).value);
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
          value={rgbColour.green}
          onChange={e => {
            const green = Number.parseInt(e.target.value);
            const newColour: Colour = {
              kind: "rgb",
              value: { ...rgbColour, green }
            };
            setColour(toHsl(newColour).value);
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
          value={rgbColour.blue}
          onChange={e => {
            const blue = Number.parseInt(e.target.value);
            const newColour: Colour = {
              kind: "rgb",
              value: { ...rgbColour, blue }
            };
            setColour(toHsl(newColour).value);
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
          value={roundFloat(currentAlpha)}
          onChange={e => {
            const alpha = Number.parseFloat(e.target.value);
            setColour({ ...colour, alpha });
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
  const currentAlpha = colour.alpha === undefined ? 1.0 : colour.alpha;
  return (
    <div className={styles.inputPanel}>
      <div className={styles.inputField}>
        <input
          type="number"
          className={styles.input}
          min={0}
          max={360}
          value={Math.round(colour.hue)}
          onChange={e => {
            const hue = Number.parseInt(e.target.value);
            setColour({ ...colour, hue });
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
          value={Math.round(colour.saturation)}
          onChange={e => {
            const saturation = Number.parseInt(e.target.value);
            setColour({ ...colour, saturation });
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
          value={Math.round(colour.lightness)}
          onChange={e => {
            const lightness = Number.parseInt(e.target.value);
            setColour({ ...colour, lightness });
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
          value={roundFloat(currentAlpha)}
          onChange={e => {
            const alpha = Number.parseFloat(e.target.value);
            setColour({ ...colour, alpha });
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
  const currentColour: Colour = { kind: "hsl", value: colour };
  const hex = toHex(currentColour);
  const [value, setValue] = useState(hex);

  useEffect(() => {
    const valueColour = parseHex(value);
    // This effect is necessary to update the value of the input field when
    // a new colour is rendered, since it is controlled by the state and
    // overrules the prop.
    // But colours passed as prop are always full Hex strings, and when the user
    // entered a short version, it would get overwritten immediately.
    // That's rather jumpy and therefore it only gets overwritten when the
    // colours are actually different.
    if (valueColour === undefined || coloursEqual(valueColour, currentColour)) {
      return;
    }
    setValue(hex);
  }, [hex, value, currentColour]);

  return (
    <div className={styles.inputPanel}>
      <div className={styles.inputField}>
        <input
          className={styles.input}
          value={value}
          onChange={e => {
            const rgbColour = parseHex(e.target.value);
            setValue(e.target.value);
            if (rgbColour !== undefined) {
              const newColour = toHsl(rgbColour).value;
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
  colour: Hsl;
  setColour: (colour: Hsl) => void;
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
