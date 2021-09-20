import { css, cx } from "@emotion/css";
import { cssVars } from "../theme.styles";

export const container = css({
  display: "flex",
  position: "relative",
  height: "40vh",
});

export const sidebar = css({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  marginLeft: "0.8rem",
});

export const title = css({
  marginBottom: "0.3rem",
  color: cssVars.fg3,
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  overflow: "hidden",
  maxWidth: "330px",
});

export const strokeWidth = 2;

export const svg = css({
  strokeWidth: `${strokeWidth}px`,
  fill: "none",
  height: "100%",
  flexShrink: 0,
});

export const plotElement = css({
  vectorEffect: "non-scaling-stroke",
  ":hover": {
    strokeWidth: `${2.5 * strokeWidth}px`,
  },
});

export const grid = css({
  stroke: cssVars.plot.axis,
});

export const axis = css({
  vectorEffect: "non-scaling-stroke",
});

export const guide = css({
  vectorEffect: "non-scaling-stroke",
  stroke: cssVars.plot.grid,
  strokeWidth: `${strokeWidth / 2}px`,
});

export const labelSize = 2;

export const labelsX = css({
  fill: cssVars.plot.label,
  fontSize: `${labelSize}px`,
  textAnchor: "middle",
});

export const labelsY = css({
  fill: cssVars.plot.label,
  fontSize: `${labelSize}px`,
  textAnchor: "end",
});

export const tooltip = css({
  display: "flex",
  flexDirection: "column",
  padding: "0.6rem",
  color: cssVars.plot.tooltip.fg,
  background: cssVars.plot.tooltip.bg,
  border: `2px solid ${cssVars.plot.tooltip.border}`,
  borderRadius: "6px",
  marginBottom: "0.2em",
  marginRight: "0.2em",
  overflow: "hidden",
});

export const tooltipTitle = css({
  fontWeight: 500,
  margin: "0 auto 0.8rem auto",
});

export const tooltipList = css({
  display: "flex",
  flexDirection: "column",
  fontSize: "0.8rem",
});

export const tooltipEntry = css({
  display: "flex",
  margin: "0.1em",
});

export const tooltipEntryText = css({
  display: "flex",
  justifyContent: "space-between",
  flexGrow: 1,
  marginLeft: "0.5em",
});

export const tooltipLabel = css({
  marginRight: "1.2em",
  fontWeight: 600,
  whiteSpace: "nowrap",
});

export const tooltipLabelHovered = cx(
  tooltipLabel,
  css({
    fontWeight: 800,
  })
);

export const tooltipValue = css({
  fontWeight: 500,
  color: "rgba(247, 247, 247, 0.890)",
});

export const tooltipValueHovered = cx(
  tooltipValue,
  css({
    fontWeight: 800,
    color: cssVars.plot.tooltip.fg,
  })
);

export const tooltipColour = css({
  width: "0.8em",
  height: "0.8em",
  flexShrink: 0,
  borderRadius: "50%",
  border: `1px solid ${cssVars.border2}`,
  cursor: "pointer",
});
