import { css, cx } from "emotion";

export const headerColour = "#353535";

export const header = css({
  display: "flex",
  position: "relative",
  justifyContent: "space-between",
  width: "100%",
  height: "3rem",
  overflow: "auto",
  background: headerColour,
  transition: "all 0.2s ease-out",
  boxSizing: "border-box",
  padding: "0 1rem"
});

export const headerOpen = cx(
  header,
  css({
    "@media only screen and (max-width: 896px)": {
      height: "100%"
    }
  })
);

export const nav = css({
  display: "flex",
  flexDirection: "column",
  flexWrap: "wrap",
  alignContent: "flex-start",
  width: "100%",
  overflow: "hidden",
  transition: "all 0.2s ease-out"
});

export const item = css({
  display: "flex",
  position: "relative",
  flexDirection: "column",
  justifyContent: "center",
  flexShrink: 0,
  margin: "0 0.5em",
  textDecoration: "none",
  height: "3rem",
  color: "#aaa",
  fontWeight: 500,
  userSelect: "none",
  cursor: "pointer",
  overflow: "hidden",
  // Firefox draws a border on it when clicking, get rid of it.
  outline: "none",
  transition: "padding, height 0.2s ease-out, visibility 0s 0.2s ease-out",
  "@media only screen and (max-width: 896px)": {
    // Unfortunately, this works either nicely when the menu is closed, where
    // the text gets smaller and then half way through it disappears, given the
    // collapse effect, or when going from small screen to big screen, for which
    // the visibility needs to turned off immediately, otherwise you can see the
    // text being pushed off screen.
    // Since it's more common to stay in a screen size, that has been
    // prioritised.
    transition: "padding, height 0.2s ease-out, visibility 0.1s ease-out",
    height: 0,
    margin: 0,
    padding: 0,
    visibility: "hidden"
  }
});

export const itemOpen = cx(
  item,
  css({
    "@media only screen and (max-width: 896px)": {
      width: "inherit",
      height: "3rem",
      margin: "inherit",
      padding: "inherit",
      visibility: "visible"
    }
  })
);

export const activeOpen = cx(
  itemOpen,
  css({
    color: "#fff"
  })
);

export const active = cx(
  item,
  css({
    color: "#fff",
    "@media only screen and (max-width: 896px)": {
      width: "inherit",
      height: "3rem",
      margin: "inherit",
      padding: "unset",
      visibility: "unset"
    }
  })
);

export const burgerMenu = css({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "3rem",
  height: "3rem",
  cursor: "pointer",
  visibility: "hidden",
  "@media only screen and (max-width: 896px)": {
    visibility: "visible"
  }
});

export const burgerIcon = css({
  display: "block",
  position: "relative",
  background: "#fff",
  width: "18px",
  height: "2px",
  flexShrink: 0,
  transition: "all 0.2s ease-out",
  "::before": {
    content: "''",
    position: "absolute",
    background: "#fff",
    width: "100%",
    height: "100%",
    flexShrink: 0,
    top: "-5px",
    transition: "all 0.2s ease-out"
  },
  "::after": {
    content: "''",
    position: "absolute",
    background: "#fff",
    width: "100%",
    height: "100%",
    flexShrink: 0,
    top: "5px",
    transition: "all 0.2s ease-out"
  }
});

export const burgerIconOpen = cx(
  burgerIcon,
  css({
    background: "transparent",
    "::before": {
      top: 0,
      transform: "rotate(45deg)"
    },
    "::after": {
      top: 0,
      transform: "rotate(-45deg)"
    }
  })
);
