import { css, cx } from "emotion";
import { plus } from "./Commands.styles";

export const overlay = css({
  width: "100%",
  height: "100%",
  position: "absolute",
  zIndex: 200,
  background: "rgba(0, 0, 0, 0.97)",
  overflow: "hidden",
  opacity: 1,
  transition: "opacity 0.3s ease"
});

export const overlayHidden = cx(
  overlay,
  css({
    height: 0,
    width: 0,
    opacity: 0,
    transition: "opacity 0.3s ease, width 0s 0.3s, height 0s 0.3s"
  })
);

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

export const content = css({
  display: "flex",
  height: "100%",
  overflow: "scroll",
  cursor: "grab",
  ":active": {
    cursor: "grabbing"
  }
});
