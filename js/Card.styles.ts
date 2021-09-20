import { css, cx } from "@emotion/css";
import { boxShadow } from "./colour/ColourPicker.styles";
import { cssVars } from "./theme.styles";

export const card = css({
  display: "flex",
  flexDirection: "column",
  flexShrink: 0,
  padding: "1rem",
  marginBottom: "1rem",
  borderRadius: "4px",
  width: "100%",
  minWidth: "20rem",
  background: cssVars.card.bg,
  boxShadow,
});

export const content = css({
  display: "flex",
  overflow: "hidden",
  flexDirection: "column",
});

export const categoryContent = css({
  padding: "0 0.8rem",
  overflow: "scroll",
});

export const categoryCard = css({
  display: "flex",
  flexShrink: 0,
  flexDirection: "column",
  marginBottom: "0.2rem",
  overflow: "hidden",
  maxHeight: "66vh",
});

export const title = css({
  display: "flex",
  position: "relative",
  flexDirection: "column",
  alignItems: "center",
  fontSize: "1.1rem",
  marginBottom: "1rem",
});

export const categoryTitle = css({
  position: "relative",
  padding: "0.8rem",
  marginBottom: "0.8rem",
  borderBottom: `1px solid ${cssVars.card.border}`,
  cursor: "pointer",
  userSelect: "none",
  "::before": {
    content: "''",
    position: "absolute",
    top: "1rem",
    flexShrink: 0,
    height: "0.4rem",
    width: "0.4rem",
    color: cssVars.card.icon.fg,
    borderStyle: "solid",
    // All mouse events are passed through the element below it.
    pointerEvents: "none",
    borderWidth: "0 2px 2px 0",
    transform: "rotate(45deg)",
    transition: "transform 0.2s ease-in-out",
  },
  ":hover": {
    background: cssVars.card.hover,
    "::before": {
      color: cssVars.card.icon.hover,
    },
  },
});

export const categoryTitleCollapsed = cx(
  categoryTitle,
  css({
    "::before": {
      // Rotate to make it point down
      transform: "rotate(-45deg)",
    },
  })
);

export const category = css({
  fontWeight: 500,
  color: cssVars.fg3,
  marginLeft: "1.4rem",
});

export const name = css({
  fontStyle: "italic",
});

export const arrowLeftDisabled = css({
  fill: cssVars.card.arrow.disabled,
  height: "1em",
  width: "1em",
  cursor: "default",
});

export const arrowLeft = css({
  fill: cssVars.card.arrow.enabled,
  height: "1em",
  width: "1em",
  ":hover": {
    fill: cssVars.card.arrow.hover,
  },
});

export const arrowRight = cx(arrowLeft, css({ transform: "rotate(180deg)" }));
export const arrowRightDisabled = cx(
  arrowLeftDisabled,
  css({ transform: "rotate(180deg)" })
);

export const steps = css({
  display: "flex",
  fontSize: "0.9rem",
  alignItems: "center",
  marginTop: "0.8rem",
});

export const categorySteps = css({
  display: "flex",
  fontSize: "0.9rem",
  alignItems: "center",
  marginBottom: "1.2rem",
  justifyContent: "center",
});

export const step = css({
  color: cssVars.fg3,
  height: "1em",
  minWidth: "1em",
  margin: "0 0.4em",
  flexShrink: 0,
  cursor: "pointer",
  userSelect: "none",
  ":hover": {
    color: cssVars.card.arrow.hover,
  },
});

export const stepEllipsis = cx(
  step,
  css({
    cursor: "default",
    userSelect: "none",
    ":hover": {
      color: "unset",
    },
  })
);

export const input = css({
  background: "none",
  height: "2em",
  width: "3em",
  margin: "0 0.4rem",
  border: `thin solid ${cssVars.input.border}`,
  borderRadius: "4px",
  textAlign: "center",
  color: cssVars.fg,
  // Get rid of the arrows at the end
  // This only works for Firefox
  appearance: "textfield",
  // This is for the other browsers
  "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
    appearance: "none",
  },
  ":hover": {
    borderColor: cssVars.input.hover.border,
  },
  "::placeholder": {
    color: cssVars.input.placeholder,
    textAlign: "center",
    // Firefox lowers the opacity for the placeholders, but that has already
    // been incorporated into the text colour, so that would double dip.
    opacity: 1,
  },
});

export const visibility = css({
  position: "absolute",
  width: "1.2rem",
  height: "1.2rem",
  flexShrink: 0,
  top: 0,
  right: "0.4rem",
  cursor: "pointer",
});
