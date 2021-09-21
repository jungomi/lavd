import { css, cx } from "@emotion/css";
import { cssVars } from "./theme.styles";

export const smallImageSize = 200;

export const title = css({
  display: "flex",
  flexDirection: "column",
  flexShrink: 0,
  marginBottom: "0.8rem",
});

export const category = css({
  fontSize: "1.1rem",
  fontWeight: 500,
  color: cssVars.fg3,
  marginBottom: "0.2rem",
});

export const categoryContent = css({
  display: "flex",
  overflow: "hidden",
});

export const name = css({
  fontStyle: "italic",
});

export const sidebar = css({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  marginLeft: "0.8rem",
  maxWidth: "20rem",
});

export const classList = css({
  display: "flex",
  flexDirection: "column",
  marginBottom: "2rem",
});

export const classListTitle = css({
  fontWeight: 500,
  color: cssVars.fg3,
  marginBottom: "0.8rem",
});

export const classEntry = css({
  position: "relative",
  display: "flex",
  marginBottom: "0.1rem",
  alignItems: "center",
  fontWeight: 300,
});

export const imageCard = css({
  display: "flex",
});

export const imageOverlayContainer = css({
  display: "flex",
  position: "relative",
  overflow: "hidden",
});

export const imageOverlayContainerFullscreen = css({
  margin: "0 auto",
});

export const imageOverlayFullscreen = css({
  ":active": {
    cursor: "grabbing",
  },
});

export const imageOverlay = cx(
  imageOverlayFullscreen,
  css({
    overflow: "scroll",
    // Workaround for Firefox to prevent scrollbars from piercing through the
    // fullscreen overlay. For some reason the scrollbars of the elements under
    // the actual overlay are always shown, but that somehow prevents it.
    opacity: 0.999,
  })
);

export const imageContainer = css({
  display: "flex",
  position: "relative",
  flexShrink: 0,
  // Fit to the content, so the SVG overlay will also have the same size as the
  // image, since it will take the full size of its container.
  width: "fit-content",
  height: "fit-content",
  userSelect: "none",
});

export const imageContainerFullscreen = cx(
  imageContainer,
  css({
    margin: "2rem",
  })
);

export const expandSmall = css({
  width: "2.3rem",
  height: "2.3rem",
  padding: "0.5rem",
  cursor: "pointer",
  fill: "#555555",
  ":hover": {
    fill: "#404040",
  },
});

export const expand = cx(
  expandSmall,
  css({
    position: "absolute",
    zIndex: 10,
    top: 0,
    right: "0.5rem",
  })
);

export const strokeWidth = 2;

export const svg = css({
  position: "absolute",
  strokeWidth: `${strokeWidth}px`,
});

export const colour = css({
  width: "2.3rem",
  height: "0.8rem",
  flexShrink: 0,
  borderRadius: "0.6rem",
  border: `1px solid ${cssVars.border}`,
  cursor: "pointer",
  marginRight: "0.4rem",
});

export const probability = css({
  display: "flex",
  alignItems: "center",
  marginBottom: "2rem",
});

export const probabilityLabel = css({
  marginRight: "0.5rem",
  color: cssVars.fg3,
});

export const probabilityInput = css({
  background: "none",
  height: "2rem",
  border: `thin solid ${cssVars.input.border}`,
  borderRadius: "4px",
  color: cssVars.fg,
  padding: "0 0.6rem",
  width: "9rem",
  ":hover": {
    borderColor: cssVars.input.hover.border,
  },
  ":focus": {
    outline: "1px solid",
  },
  "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
    cursor: "pointer",
  },
  "::placeholder": {
    color: cssVars.input.placeholder,
    textAlign: "center",
    // Firefox lowers the opacity for the placeholders, but that has already
    // been incorporated into the text colour, so that would double dip.
    opacity: 1,
  },
});

export const tooltipTitle = css({
  fontWeight: 500,
  margin: "0 auto 0.8rem auto",
});

export const tooltipLabel = css({
  marginRight: "0.4em",
  fontWeight: 600,
  whiteSpace: "nowrap",
});

export const tooltipValue = css({
  fontWeight: 500,
  color: "rgba(247, 247, 247, 0.890)",
});

export const tooltipContainer = css({
  position: "relative",
  zIndex: 2,
});

export const tooltipBoxList = css({
  position: "absolute",
  display: "flex",
  flexWrap: "wrap",
  flexDirection: "column-reverse",
  height: "100%",
  marginLeft: "0.8rem",
});

export const tooltipBoxListFullscreen = cx(
  tooltipBoxList,
  css({
    position: "fixed",
    flexWrap: "wrap-reverse",
    bottom: 0,
    right: 0,
    padding: "1rem",
    height: "unset",
    pointerEvents: "none",
  })
);

export const tooltipBox = css({
  display: "flex",
  flexDirection: "column",
  padding: "0.6rem",
  color: cssVars.plot.tooltip.fg,
  background: cssVars.plot.tooltip.bg,
  border: `2px solid  ${cssVars.plot.tooltip.border}`,
  borderRadius: "6px",
  marginBottom: "0.2em",
  marginRight: "0.2em",
});

export const tooltipBoxFullscreen = cx(
  tooltipBox,
  css({
    background: "rgba(50, 52, 56, 0.9)",
  })
);

export const tooltipBoxEntry = css({
  display: "flex",
  justifyContent: "space-between",
  fontSize: "0.8rem",
});

export const thumbnail = css({
  position: "absolute",
  width: "100%",
  height: "100%",
  filter: "blur(10px)",
  transition:
    "opacity 0.2s ease-in-out, filter 0.1s ease-in-out, width 0s 0.2s, height 0s 0.2s",
});

export const thumbnailHidden = cx(
  thumbnail,
  css({
    width: 0,
    height: 0,
    opacity: 0,
    filter: "unset",
  })
);
