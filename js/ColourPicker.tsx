import React, { useEffect, useRef, useState } from "react";
import * as styles from "./ColourPicker.styles";
import { Colour, colourString, Hsl, toHsl, toRgb } from "./plot/colour";

function clamp(x: number, min: number, max: number): number {
  return Math.min(Math.max(min, x), max);
}

// Round a float to two decimal places
function roundFloat(x: number, precision: number = 2): number {
  const factor = 10 ** precision;
  return Math.round(x * factor) / factor;
}

const maxX = styles.fieldWidth - styles.pointerSize / 4;
const maxY = styles.fieldHeight - styles.pointerSize / 4;

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

type Props = {
  colour: Colour;
  onSelect: (newColour: Colour) => void;
};

type InputFormat = "rgb" | "hsl";

const movingStates = {
  off: { field: false, hue: false, alpha: false },
  field: { field: true, hue: false, alpha: false },
  hue: { field: false, hue: true, alpha: false },
  alpha: { field: false, hue: false, alpha: true }
};

export const ColourPicker: React.FC<Props> = ({ colour, onSelect }) => {
  const [currentColour, setCurrentColour] = useState(toHsl(colour).value);
  const [isMoving, setMoving] = useState(movingStates.off);
  const [inputFormat, setInputFormat] = useState<InputFormat>("rgb");
  const popupRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const alphaRef = useRef<HTMLDivElement>(null);

  const currentAlpha =
    currentColour.alpha === undefined ? 1.0 : currentColour.alpha;
  const posX = clamp((currentColour.saturation * maxX) / 100, 0, maxX);
  const posY = clamp(
    ((100 -
      (currentColour.lightness / (2 - currentColour.saturation / 100)) * 2) *
      maxY) /
      100,
    0,
    maxY
  );
  const posHue = (currentColour.hue / 360) * styles.sliderWidth;
  const posAlpha = currentAlpha * styles.sliderWidth;

  const disableMoving = () => {
    setMoving(movingStates.off);
  };
  const updateColour = (clientX: number, clientY: number) => {
    if (fieldRef.current !== null) {
      const { left, top } = fieldRef.current.getBoundingClientRect();
      const x = clamp(clientX - left, 0, maxX);
      const y = clamp(clientY - top, 0, maxY);
      const saturation = (x / maxX) * 100;
      const lightness =
        Math.round((100 - (y / maxY) * 100) / 2) * (2 - saturation / 100);
      setCurrentColour({ ...currentColour, saturation, lightness });
    }
  };
  const updateHue = (clientX: number) => {
    if (hueRef.current !== null) {
      const { left } = hueRef.current.getBoundingClientRect();
      const x = clamp(clientX - left, 0, styles.sliderWidth);
      const hue = Math.round((x / styles.sliderWidth) * 360);
      setCurrentColour({ ...currentColour, hue });
    }
  };
  const updateAlpha = (clientX: number) => {
    if (alphaRef.current !== null) {
      const { left } = alphaRef.current.getBoundingClientRect();
      const x = clamp(clientX - left, 0, styles.sliderWidth);
      const alpha = x / styles.sliderWidth;
      setCurrentColour({ ...currentColour, alpha });
    }
  };
  const updateCoords = (e: MouseEvent) => {
    if (isMoving.field && fieldRef.current !== null) {
      e.preventDefault();
      updateColour(e.clientX, e.clientY);
    } else if (isMoving.hue && hueRef.current !== null) {
      e.preventDefault();
      updateHue(e.clientX);
    } else if (isMoving.alpha && alphaRef.current !== null) {
      e.preventDefault();
      updateAlpha(e.clientX);
    }
  };
  const outsideClick = (e: MouseEvent) => {
    if (
      e.button === 0 &&
      popupRef.current &&
      !popupRef.current.contains(e.target as Node)
    ) {
      onSelect({ kind: "hsl", value: currentColour });
    }
  };
  const pressEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onSelect({ kind: "hsl", value: currentColour });
    }
  };
  // A global event listener on the mouse position, since the slider can be
  // moved even when the mouse is not directly inside the colour picker.
  // e.g. Moving up and down even though the mouse is far off the left.
  useEffect(() => {
    window.addEventListener("mousedown", outsideClick);
    window.addEventListener("mousemove", updateCoords);
    window.addEventListener("mouseup", disableMoving);
    window.addEventListener("keydown", pressEscape);
    // Clean up when the component is destroyed
    return () => {
      window.removeEventListener("mousedown", outsideClick);
      window.removeEventListener("mousemove", updateCoords);
      window.removeEventListener("mouseup", disableMoving);
      window.removeEventListener("keydown", pressEscape);
    };
  });

  const bgColour = colourString({
    kind: "hsl",
    value: { hue: currentColour.hue, saturation: 100, lightness: 50 }
  });
  const previewColour = colourString({
    kind: "hsl",
    value: currentColour
  });

  return (
    <div className={styles.popup} ref={popupRef}>
      <div
        className={styles.colourField}
        style={{ background: bgColour }}
        ref={fieldRef}
        onMouseDown={e => {
          // Do nothing when it's not a left click
          if (e.button !== 0) {
            return;
          }
          e.preventDefault();
          // Set the colour to where the user clicked.
          updateColour(e.clientX, e.clientY);
          setMoving(movingStates.field);
        }}
      >
        <div className={styles.whiteGradient}>
          <div className={styles.blackGradient}>
            <div
              className={styles.pointer}
              style={{ transform: `translate3d(${posX}px, ${posY}px, 0)` }}
            ></div>
          </div>
        </div>
      </div>
      <div className={styles.panel}>
        <span
          className={styles.preview}
          style={{ background: previewColour }}
        />
        <div className={styles.sliders}>
          <div
            className={styles.hueSlider}
            ref={hueRef}
            onMouseDown={e => {
              // Do nothing when it's not a left click
              if (e.button !== 0) {
                return;
              }
              e.preventDefault();
              // Set the hue to where the user clicked.
              updateHue(e.clientX);
              setMoving(movingStates.hue);
            }}
          >
            <div
              className={styles.sliderPointer}
              style={{ transform: `translatex(${posHue}px)` }}
            ></div>
          </div>
          <div
            className={styles.alphaSlider}
            ref={alphaRef}
            onMouseDown={e => {
              // Do nothing when it's not a left click
              if (e.button !== 0) {
                return;
              }
              e.preventDefault();
              // Set the alpha to where the user clicked.
              updateAlpha(e.clientX);
              setMoving(movingStates.alpha);
            }}
          >
            <div
              className={styles.alphaSlider}
              style={{
                background: `linear-gradient(to right, rgb(0, 0, 0, 0), ${bgColour})`
              }}
            >
              <div
                className={styles.sliderPointer}
                style={{ transform: `translatex(${posAlpha}px)` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      {inputFormat === "rgb" && (
        <RgbInput
          colour={currentColour}
          setColour={setCurrentColour}
          switchMode={() => setInputFormat("hsl")}
        />
      )}
      {inputFormat === "hsl" && (
        <HslInput
          colour={currentColour}
          setColour={setCurrentColour}
          switchMode={() => setInputFormat("rgb")}
        />
      )}
    </div>
  );
};
