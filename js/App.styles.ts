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
  padding: "1.5rem",
  marginBottom: "1.5rem",
  overflow: "scroll",
  width: "100%",
  background: bgColour,
  flexWrap: "wrap",
  alignContent: "flex-start"
});
