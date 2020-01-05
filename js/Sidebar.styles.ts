import { css, cx } from "emotion";
import { bgColour } from "./App.styles";

export const sidebar = css({
  display: "flex",
  height: "100%",
  width: "18rem",
  position: "relative",
  padding: "1.0rem",
  flexDirection: "column",
  flexShrink: 0,
  // The transition is `In Out - Cubic` in Chrome dev tools.
  transition: "all .5s cubic-bezier(0.65, 0.05, 0.36, 1)",
  background: bgColour,
  borderRight: "2px solid #e9e9e9",
  zIndex: 100
});

export const sidebarHidden = cx(
  sidebar,
  css({
    width: 0,
    border: 0,
    padding: 0,
    margin: 0
  })
);

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

const toggleOffset = "20rem";

export const toggle = css({
  outline: "none",
  position: "absolute",
  top: 0,
  left: toggleOffset,
  transition: "all 0.5s cubic-bezier(0.65, 0.05, 0.36, 1)",
  cursor: "pointer",
  width: "1.5rem",
  height: "1.5rem",
  fill: "#8c8c8c",
  transform: "rotate(180deg)"
});

export const toggleHidden = cx(
  toggle,
  css({
    // Moves the icon back to 0. At the same time it removes the rotation of the
    // icon, which should be rotated to point in the opposite direction.
    transform: `translateX(-${toggleOffset})`
  })
);

export const nameList = css({
  // The visibility is delayed for 0.3s to avoid clamping the text into small
  // spaces.
  transition: "visibility 0s 0.3s"
});

export const nameListHidden = css({
  visibility: "hidden"
});
