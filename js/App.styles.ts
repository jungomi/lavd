import { css } from "@emotion/css";
import { cssVars } from "./theme.styles";

export const wrapper = css({
  display: "flex",
  flexShrink: 0,
  height: "100%",
  position: "relative",
  background: cssVars.bg,
  color: cssVars.fg,
});

export const main = css({
  display: "flex",
  flexDirection: "column",
  position: "relative",
  padding: "1.5rem",
  paddingTop: "1rem",
  overflow: "scroll",
  width: "100%",
});

export const content = css({
  display: "flex",
  flexDirection: "column",
  flexShrink: 0,
  position: "relative",
  marginBottom: "1.5rem",
  marginRight: "1.5rem",
});
