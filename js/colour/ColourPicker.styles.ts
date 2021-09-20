import { css } from "@emotion/css";
import { cssVars } from "../theme.styles";

export const boxShadow = `
  0px 3px 3px -2px rgba(0, 0, 0, 0.2),
  0px 3px 4px 0px rgba(0, 0, 0, 0.14),
  0px 1px 8px 0px rgba(0, 0, 0, 0.12)
`;

export const whiteGradient = css({
  width: "100%",
  height: "100%",
  background: "linear-gradient(to right, white, rgba(0, 0, 0, 0))",
});

export const blackGradient = css({
  width: "100%",
  height: "100%",
  background: "linear-gradient(to bottom, rgba(0, 0, 0, 0), black)",
});

export const fieldWidth = 320;
export const fieldHeight = 160;
export const sliderWidth = 180;
export const sliderHeight = 12;
export const pointerSize = 12;
export const sliderPointerSize = 16;

export const popup = css({
  position: "absolute",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  top: "2rem",
  background: cssVars.picker.bg,
  border: `1px solid ${cssVars.border2}`,
  zIndex: 100,
  boxShadow,
});

export const colourField = css({
  width: `${fieldWidth}px`,
  height: `${fieldHeight}px`,
  overflow: "hidden",
});

export const pointer = css({
  position: "relative",
  width: `${pointerSize}px`,
  height: `${pointerSize}px`,
  // Since it's a circle and the centre is the point of interest, it's moved by
  // half of the size, such that the centre is at the very corner at the start.
  right: `${pointerSize / 2}px`,
  bottom: `${pointerSize / 2}px`,
  background: "transparent",
  border: "2.5px solid white",
  boxShadow,
  borderRadius: "50%",
  cursor: "pointer",
});

export const panel = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-evenly",
  width: "100%",
  padding: "0.8rem 0",
});

export const preview = css({
  width: "2.1rem",
  height: "2.1rem",
  flexShrink: 0,
  borderRadius: "50%",
  border: `1px solid ${cssVars.border2}`,
});

export const sliders = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export const hueSlider = css({
  width: `${sliderWidth}px`,
  height: `${sliderHeight}px`,
  borderRadius: "1rem",
  background: `
    linear-gradient(
      to right,
      #F00 0%,
      #FF0 16.66%,
      #0F0 33.33%,
      #0FF 50%,
      #00F 66.66%,
      #F0F 83.33%,
      #F00 100%
    )
  `,
  marginBottom: "0.6rem",
});

export const alphaSlider = css({
  width: `${sliderWidth}px`,
  height: `${sliderHeight}px`,
  borderRadius: "1rem",
  background:
    "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAGElEQVQYlWNgYGCQwoKxgqGgcJA5h3yFAAs8BRWVSwooAAAAAElFTkSuQmCC) repeat",
});

export const sliderPointer = css({
  position: "relative",
  width: `${sliderPointerSize}px`,
  height: `${sliderPointerSize}px`,
  // Since it's a circle and the centre is the point of interest, it's moved by
  // half of the size, such that the centre is at the very start.
  right: `${sliderPointerSize / 2}px`,
  bottom: "2px",
  background: "#ffffff",
  boxShadow,
  borderRadius: "50%",
  cursor: "pointer",
});
