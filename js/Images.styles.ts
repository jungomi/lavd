import { css } from "emotion";

const labelColour = "#616161";

export const title = css({
  display: "flex",
  flexDirection: "column",
  flexShrink: 0,
  marginBottom: "0.8rem"
});

export const category = css({
  fontSize: "1.1rem",
  fontWeight: 500,
  color: labelColour,
  marginBottom: "0.2rem"
});

export const categoryContent = css({
  display: "flex",
  overflow: "hidden"
});

export const name = css({
  fontStyle: "italic"
});

export const sidebar = css({
  position: "relative",
  display: "flex",
  flexDirection: "column",
  marginLeft: "0.8rem",
  maxWidth: "20rem"
});

export const classList = css({
  display: "flex",
  flexDirection: "column",
  marginBottom: "2rem"
});

export const classListTitle = css({
  fontWeight: 500,
  color: labelColour,
  margin: "0 auto 0.8rem auto"
});

export const classEntry = css({
  position: "relative",
  display: "flex",
  marginBottom: "0.1rem",
  alignItems: "center",
  fontWeight: 300
});

export const imageCard = css({
  display: "flex"
});

export const imageOverlayContainer = css({
  overflow: "scroll"
});

export const imageOverlay = css({
  display: "flex",
  position: "relative",
  flexShrink: 0,
  // Fit to the content, so the SVG overlay will also have the same size as the
  // image, since it will take the full size of its container.
  width: "fit-content",
  height: "fit-content"
});

export const strokeWidth = 2;

export const svg = css({
  position: "absolute",
  strokeWidth: `${strokeWidth}px`
});

export const colour = css({
  width: "2.5rem",
  height: "0.7rem",
  flexShrink: 0,
  borderRadius: "0.6rem",
  border: "1px solid #dadada",
  cursor: "pointer",
  marginRight: "0.4rem"
});

export const probability = css({
  display: "flex",
  alignItems: "center",
  marginBottom: "2rem"
});

export const probabilityLabel = css({
  marginRight: "0.5rem",
  color: labelColour
});

export const probabilityInput = css({
  background: "none",
  height: "1.6rem",
  border: "thin solid rgba(0, 0, 0, 0.12)",
  borderRadius: "4px",
  textAlign: "center",
  color: "rgba(0, 0, 0, 0.6)",
  // Firefox is very weird with <input> in flex, without setting a (max-)width,
  // it is blown out of proportion and takes up way too much space and causes
  // the label to wrap, which shouldn't happen since there is plenty of space
  // without the input being so massive (in the worst case it even breaks out of
  // the container).
  // This restricts it roughly to the size that Chrome naturally renders.
  maxWidth: "4rem"
});

export const tooltipTitle = css({
  fontWeight: 500,
  margin: "0 auto 0.8rem auto"
});

export const tooltipLabel = css({
  marginRight: "0.4em",
  fontWeight: 600
});

export const tooltipValue = css({
  fontWeight: 500,
  color: "rgba(247, 247, 247, 0.890)"
});

export const tooltipBoxList = css({
  position: "absolute",
  display: "flex",
  flexWrap: "wrap",
  flexDirection: "column-reverse",
  height: "100%"
});

export const tooltipBox = css({
  display: "flex",
  flexDirection: "column",
  padding: "0.6rem",
  color: "#ffffff",
  background: "rgba(0, 0, 0, 0.65)",
  border: "2px solid #666666",
  borderRadius: "6px",
  width: "fit-content",
  marginBottom: "0.2em",
  marginRight: "0.2em"
});

export const tooltipBoxEntry = css({
  display: "flex",
  justifyContent: "space-between",
  fontSize: "0.8rem"
});
