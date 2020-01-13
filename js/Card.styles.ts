import { css } from "emotion";
import { boxShadow } from "./colour/ColourPicker.styles";

const labelColour = "#616161";

export const card = css({
  display: "flex",
  flexDirection: "column",
  padding: "1rem",
  marginRight: "1rem",
  marginBottom: "1rem",
  borderRadius: "4px",
  boxShadow
});

export const title = css({
  display: "flex",
  flexDirection: "column",
  flexShrink: 0,
  marginBottom: "0.8rem"
});

export const category = css({
  fontSize: "1.1rem",
  fontWeight: 500,
  color: labelColour,
  marginBottom: "0.2rem"
});

export const name = css({
  fontStyle: "italic"
});
