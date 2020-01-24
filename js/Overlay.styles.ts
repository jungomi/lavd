import { css, cx } from "emotion";
import { plus } from "./Commands.styles";

export const overlay = css({
  width: "100%",
  height: "100%",
  position: "absolute",
  zIndex: 200,
  background: "rgba(0, 0, 0, 0.97)",
  overflow: "hidden"
});

export const close = css({
  display: "flex",
  position: "absolute",
  width: "100%",
  justifyContent: "flex-end",
  zIndex: 2
});

export const closeIcon = cx(
  plus,
  css({
    width: "3.5rem",
    height: "3.5rem",
    transform: "rotate(45deg)"
  })
);
