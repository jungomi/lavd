import { css } from "emotion";

export const container = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
});

export const title = css({
  marginBottom: "0.3rem",
  color: "#575757",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
  maxWidth: "330px"
});
