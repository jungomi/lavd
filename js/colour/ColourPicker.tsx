import React, { useEffect, useRef, useState } from "react";
import { ColourInput } from "./ColourInput";
import * as styles from "./ColourPicker.styles";
import { Colour, colourString, toHsv } from "./definition";

function clamp(x: number, min: number, max: number): number {
  return Math.min(Math.max(min, x), max);
}

const maxX = styles.fieldWidth - styles.pointerSize / 4;
const maxY = styles.fieldHeight - styles.pointerSize / 4;

type Props = {
  colour: Colour;
  onSelect: (newColour: Colour) => void;
};

const movingStates = {
  off: { field: false, hue: false, alpha: false },
  field: { field: true, hue: false, alpha: false },
  hue: { field: false, hue: true, alpha: false },
  alpha: { field: false, hue: false, alpha: true }
};

export const ColourPicker: React.FC<Props> = ({ colour, onSelect }) => {
  const [currentColour, setCurrentColour] = useState(toHsv(colour).value);
  const [isMoving, setMoving] = useState(movingStates.off);
  const popupRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const hueRef = useRef<HTMLDivElement>(null);
  const alphaRef = useRef<HTMLDivElement>(null);

  const currentAlpha =
    currentColour.alpha === undefined ? 1.0 : currentColour.alpha;
  const posX = clamp((currentColour.saturation * maxX) / 100, 0, maxX);
  const posY = clamp(((100 - currentColour.value) * maxY) / 100, 0, maxY);
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
      const value = 100 - (y / maxY) * 100;
      setCurrentColour({ ...currentColour, saturation, value });
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
      onSelect({ kind: "hsv", value: currentColour });
    }
  };
  const pressEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      onSelect({ kind: "hsv", value: currentColour });
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
    kind: "hsv",
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
      <ColourInput colour={currentColour} setColour={setCurrentColour} />
    </div>
  );
};
