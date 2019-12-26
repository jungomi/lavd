import { css } from "emotion";

export const sidebar = css({
  display: "flex",
  height: "100%",
  width: "20em",
  position: "relative",
  padding: "1.0em 1.0em",
  flexDirection: "column"
});

export const entry = css({
  position: "relative",
  display: "flex",
  alignItems: "flex-start",
  fontWeight: 300,
  margin: "0.2rem 0"
});

export const colour = css({
  width: "1.0rem",
  height: "1.0rem",
  marginRight: "0.6rem",
  flexShrink: 0,
  borderRadius: "50%",
  border: "1px solid #dadada",
  cursor: "pointer"
});
