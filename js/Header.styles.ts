import { css, cx } from "@emotion/css";
import { cssVars } from "./theme.styles";

export const header = css({
  position: "relative",
  display: "flex",
  flexShrink: 0,
  width: "100%",
  height: "3rem",
  background: cssVars.header.bg,
  borderBottom: `1px solid ${cssVars.border}`,
  transition: "all 0.2s ease-out",
  padding: "0 1rem",
  // Needs to be on top for the shadow to show
  zIndex: 100,
  "@media only screen and (max-width: 896px)": {
    padding: 0,
  },
});

export const headerOpen = cx(
  header,
  css({
    "@media only screen and (max-width: 896px)": {
      height: "100%",
      flexShrink: 0,
    },
  })
);

export const nav = css({
  display: "flex",
  flexWrap: "wrap",
  alignContent: "flex-start",
  width: "100%",
  height: "100%",
  overflow: "hidden",
  transition: "all 0.2s ease-out",
  "@media only screen and (max-width: 896px)": {
    paddingLeft: "3rem",
  },
});

export const navOpen = cx(
  nav,
  css({
    "@media only screen and (max-width: 896px)": {
      height: "unset",
      padding: "3rem 0",
    },
  })
);

export const item = css({
  display: "flex",
  position: "relative",
  alignItems: "center",
  flexShrink: 0,
  margin: "0 0.5em",
  textDecoration: "none",
  height: "3rem",
  color: cssVars.header.fg,
  fontWeight: 600,
  userSelect: "none",
  cursor: "pointer",
  overflow: "hidden",
  // Firefox draws a border on it when clicking, get rid of it.
  outline: "none",
  transition:
    "padding 0.2s ease-out, height 0.2s ease-out, visibility 0s 0.2s ease-out",
  "@media only screen and (max-width: 896px)": {
    // Unfortunately, this works either nicely when the menu is closed, where
    // the text gets smaller and then half way through it disappears, given the
    // collapse effect, or when going from small screen to big screen, for which
    // the visibility needs to turned off immediately, otherwise you can see the
    // text being pushed off screen.
    // Since it's more common to stay in a screen size, that has been
    // prioritised.
    transition:
      "padding 0.2s ease-out, height 0.2s ease-out, visibility 0.1s ease-out",
    height: 0,
    margin: 0,
    padding: 0,
    visibility: "hidden",
  },
  ":hover": {
    color: cssVars.header.hover,
  },
});

export const itemOpen = cx(
  item,
  css({
    "@media only screen and (max-width: 896px)": {
      width: "inherit",
      height: "3rem",
      margin: "unset",
      padding: "0 3rem",
      visibility: "visible",
    },
  })
);

export const activeOpen = cx(
  itemOpen,
  css({
    color: cssVars.header.active,
    ":hover": {
      color: cssVars.header.active,
    },
  })
);

export const active = cx(
  item,
  css({
    color: cssVars.header.active,
    ":hover": {
      color: cssVars.header.active,
    },
    "@media only screen and (max-width: 896px)": {
      width: "inherit",
      height: "3rem",
      margin: "unset",
      padding: "unset",
      visibility: "unset",
      ":hover": {
        color: cssVars.header.hover,
      },
    },
  })
);

export const burgerMenu = css({
  position: "absolute",
  top: 0,
  left: 0,
  display: "flex",
  alignItems: "center",
  width: "3rem",
  height: "3rem",
  cursor: "pointer",
  visibility: "hidden",
  "@media only screen and (max-width: 896px)": {
    visibility: "visible",
    width: "100%",
    padding: "0 1rem",
  },
});

export const burgerIcon = css({
  display: "block",
  position: "relative",
  background: cssVars.header.fg,
  width: "18px",
  height: "2px",
  flexShrink: 0,
  "::before": {
    content: "''",
    position: "absolute",
    background: cssVars.header.fg,
    width: "100%",
    height: "100%",
    flexShrink: 0,
    top: "-5px",
    transition: "transform 0.2s ease-out",
  },
  "::after": {
    content: "''",
    position: "absolute",
    background: cssVars.header.fg,
    width: "100%",
    height: "100%",
    flexShrink: 0,
    top: "5px",
    transition: "transform 0.2s ease-out",
  },
});

export const burgerIconOpen = cx(
  burgerIcon,
  css({
    background: "transparent",
    "::before": {
      top: 0,
      transform: "rotate(45deg)",
    },
    "::after": {
      top: 0,
      transform: "rotate(-45deg)",
    },
  })
);
