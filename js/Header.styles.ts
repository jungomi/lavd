import { css, cx } from "emotion";

export const headerColour = "#353535";

export const header = css({
  position: "relative",
  width: "100%",
  height: `48px`,
  top: 0,
  zIndex: 100,
  background: headerColour
});

export const nav = css({
  display: "flex",
  listStyle: "none",
  alignItems: "center",
  margin: "0 auto",
  padding: "0 2em",
  overflow: "hidden",
  height: "100%"
});

export const item = css({
  display: "flex",
  position: "relative",
  flexDirection: "column",
  justifyContent: "center",
  margin: "0 0.5em",
  textDecoration: "none",
  height: "100%",
  color: "#aaa",
  fontWeight: 500,
  userSelect: "none",
  cursor: "pointer",
  // Firefox draws a border on it when clicking, get rid of it.
  outline: "none",
  ":after": {
    content: '""',
    display: "block",
    background: "#fff",
    width: "100%",
    height: "2px",
    position: "absolute",
    bottom: 0,
    transition: "transform .3s ease-out",
    transform: "translateY(3px)"
  }
});

export const active = cx(
  item,
  css({
    color: "#fff",
    ":after": {
      transform: "translateY(0)"
    }
  })
);
