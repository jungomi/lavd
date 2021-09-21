import { css, cx } from "@emotion/css";
import * as commandStyles from "./Commands.styles";
import { cssVars } from "./theme.styles";

export const settings = css({
  display: "flex",
  overflow: "visible",
  zIndex: 300,
  marginRight: "1rem",
  "@media only screen and (max-width: 896px)": {
    marginRight: 0,
  },
});

export const settingsButton = css({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  font: "inherit",
  background: "none",
  width: "3rem",
  height: "3rem",
  border: "none",
  padding: 0,
  cursor: "pointer",
  outline: "none",
  userSelect: "none",
  marginLeft: "auto",
});

export const settingsIcon = css({
  fill: cssVars.header.fg,
  width: "26px",
  height: "26px",
  ":hover": {
    fill: cssVars.header.hover,
  },
});

export const panel = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "absolute",
  background: cssVars.header.bg,
  minWidth: "min(100vw, 550px)",
  padding: "1rem",
  top: 0,
  right: "2rem",
  zIndex: 300,
  cursor: "auto",
  boxShadow: cssVars.shadow,
  visibility: "hidden",
  opacity: 0,
  transition: "opacity 0.2s, visibility 0.2s",
  "@media only screen and (max-width: 896px)": {
    right: 0,
  },
});

export const panelOpen = cx(
  panel,
  css({
    visibility: "visible",
    opacity: 1,
  })
);

export const title = css({
  fontSize: "1.2rem",
  fontWeight: 500,
  color: cssVars.fg3,
  marginBottom: "1.5rem",
});

export const closeButton = cx(
  settingsButton,
  css({
    position: "absolute",
    top: 0,
    right: 0,
  })
);

export const closeIcon = cx(
  commandStyles.plus,
  css({
    width: "2rem",
    height: "2rem",
    transform: "rotate(45deg)",
  })
);

export const themes = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export const themesList = css({
  display: "flex",
  flexWrap: "wrap",
});

export const themeTitle = css({
  alignSelf: "flex-start",
  marginLeft: "1rem",
  fontSize: "1.1rem",
  fontWeight: 500,
  color: cssVars.fg3,
});

export const theme = css({
  display: "flex",
  flexDirection: "column",
  flexShrink: 0,
  margin: "0.5rem",
});

export const themePreview = css({
  display: "flex",
  flexDirection: "column",
  flexShrink: 0,
  background: cssVars.bg,
  width: "150px",
  height: "110px",
  marginBottom: "0.5rem",
  borderBottom: `1px solid ${cssVars.border}`,
});

export const themePreviewUpperHalf = cx(
  themePreview,
  css({
    position: "absolute",
    clipPath: "polygon(0 0, 0 100%, 100% 0)",
  })
);

export const previewHeader = css({
  display: "flex",
  alignItems: "center",
  height: "14px",
  background: cssVars.header.bg,
  marginBottom: "14px",
  padding: "0 6px",
  borderBottom: `1px solid ${cssVars.border}`,
});

export const headerText = css({
  display: "flex",
  background: cssVars.header.fg,
  width: "12px",
  height: "6px",
  marginLeft: "6px",
  borderRadius: "4px",
});

export const headerTextActive = cx(
  headerText,
  css({
    background: cssVars.header.active,
  })
);

export const previewLine = css({
  display: "flex",
  alignItems: "center",
  margin: "4px 10px",
});

export const previewSettings = css({
  display: "flex",
  marginLeft: "auto",
});

export const previewIcon = css({
  fill: cssVars.header.fg,
  width: "10px",
  height: "10px",
});

export const circle = css({
  display: "flex",
  background: cssVars.fg,
  width: "20px",
  height: "20px",
  border: `1px solid ${cssVars.border}`,
  borderRadius: "50%",
});

export const textLine = css({
  display: "flex",
  background: cssVars.fg,
  width: "90px",
  height: "14px",
  margin: "0 6px",
  border: `1px solid ${cssVars.border}`,
  borderRadius: "6px",
});

export const label = css({
  border: `1px solid ${cssVars.border}`,
  borderRadius: "0.3rem",
  paddingBottom: "0.5rem",
  overflow: "hidden",
  cursor: "pointer",
});

export const labelDescription = css({
  display: "flex",
  alignItems: "center",
});

export const labelText = css({
  color: cssVars.fg3,
});

export const radio = css({
  margin: "0 0.6rem",
});
