import { css } from "emotion";
import { boxShadow } from "./colour/ColourPicker.styles";

export const container = css({
  display: "flex",
  height: "fit-content",
  flexWrap: "wrap",
  marginBottom: "1rem"
});

export const imageCard = css({
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
  marginBottom: "0.8rem",
  maxWidth: "800px"
});

export const category = css({
  fontSize: "1.1rem",
  fontWeight: 500,
  color: "#616161",
  marginBottom: "0.2rem"
});

export const name = css({
  fontStyle: "italic"
});

export const image = css({
  // Prevents stretching of the image, i.e. keeps aspect ratio.
  objectFit: "contain"
});
