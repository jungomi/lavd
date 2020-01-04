import { css } from "emotion";

export const bgColour = "#f8fafc";

export const wrapper = css({
  display: "flex",
  height: "100%",
  position: "relative"
});

export const main = css({
  display: "flex",
  position: "relative",
  padding: "2.0rem",
  marginBottom: "1rem",
  overflow: "auto",
  width: "100%",
  background: bgColour,
  flexWrap: "wrap",
  alignContent: "flex-start"
});

export const noData = css({
  fontSize: "2rem",
  fontStyle: "italic",
  color: "#888",
  margin: "1rem auto"
});
