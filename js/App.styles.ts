import { css } from "emotion";

export const wrapper = css({
  display: "flex",
  height: "100%",
  position: "relative"
});

export const main = css({
  display: "flex",
  position: "relative",
  padding: "2.0rem",
  overflow: "auto",
  width: "100%",
  background: "#f8fafc",
  flexWrap: "wrap"
});

export const noData = css({
  fontSize: "2rem",
  fontStyle: "italic",
  color: "#888",
  margin: "1rem auto"
});
