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

export const classList = css({
  display: "flex",
  flexDirection: "column",
  marginLeft: "0.8rem",
  maxWidth: "20rem",
  // TODO: Remove that, but will need to have the image size, everything is kind
  // of a mess when not knowing it.
  zIndex: 20
});

export const classListTitle = css({
  fontWeight: 500,
  color: "#616161",
  margin: "0 auto 0.8rem auto"
});

export const classEntry = css({
  position: "relative",
  display: "flex",
  fontWeight: 300,
  marginBottom: "0.1rem",
  alignItems: "center"
});

export const imageOverlay = css({
  display: "flex"
});

export const svg = css({
  position: "absolute",
  strokeWidth: "2px",
  height: "100%",
  width: "100%"
});

export const colour = css({
  width: "2.5rem",
  height: "0.7rem",
  flexShrink: 0,
  borderRadius: "0.6rem",
  border: "1px solid #dadada",
  cursor: "pointer",
  marginRight: "0.4rem"
});
