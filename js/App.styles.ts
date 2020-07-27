import { css } from "emotion";

export const bgColour = "#f8fafc";

export const wrapper = css({
  display: "flex",
  flexShrink: 0,
  height: "100%",
  position: "relative",
});

export const main = css({
  display: "flex",
  flexDirection: "column",
  position: "relative",
  padding: "1.5rem",
  paddingTop: "1rem",
  overflow: "scroll",
  width: "100%",
  background: bgColour,
});

export const content = css({
  display: "flex",
  flexDirection: "column",
  flexShrink: 0,
  position: "relative",
  marginBottom: "1.5rem",
  marginRight: "1.5rem",
});
