import { css, cx } from "emotion";
import { boxShadow } from "./colour/ColourPicker.styles";

const labelColour = "#616161";
const iconColour = "#cecece";
const iconHoverColour = "#929292";

export const card = css({
  display: "flex",
  flexDirection: "column",
  padding: "1rem",
  marginBottom: "1rem",
  borderRadius: "4px",
  width: "100%",
  minWidth: "20rem",
  boxShadow
});

export const content = css({
  display: "flex",
  overflow: "hidden",
  flexDirection: "column"
});

export const categoryContent = css({
  padding: "0 0.8rem",
  overflow: "scroll"
});

export const categoryCard = css({
  display: "flex",
  flexDirection: "column",
  marginBottom: "0.2rem",
  overflow: "hidden",
  maxHeight: "66vh"
});

export const title = css({
  display: "flex",
  position: "relative",
  flexDirection: "column",
  alignItems: "center",
  fontSize: "1.1rem",
  marginBottom: "1rem"
});

export const categoryTitle = css({
  position: "relative",
  padding: "0.8rem",
  marginBottom: "0.8rem",
  borderBottom: "1px solid #eaecef",
  cursor: "pointer",
  "::before": {
    content: "''",
    position: "absolute",
    top: "1rem",
    flexShrink: 0,
    height: "0.4rem",
    width: "0.4rem",
    color: iconColour,
    borderStyle: "solid",
    // All mouse events are passed through the element below it.
    pointerEvents: "none",
    borderWidth: "0 2px 2px 0",
    transform: "rotate(45deg)",
    transition: "transform 0.2s ease-in-out"
  },
  ":hover": {
    background: "rgba(0, 0, 0, 0.02)",
    "::before": {
      color: iconHoverColour
    }
  }
});

export const categoryTitleCollapsed = cx(
  categoryTitle,
  css({
    "::before": {
      // Rotate to make it point down
      transform: "rotate(-45deg)"
    }
  })
);

export const category = css({
  fontWeight: 500,
  color: labelColour,
  marginLeft: "1.4rem"
});

export const name = css({
  fontStyle: "italic"
});

export const arrowLeftDisabled = css({
  fill: "#cccccc",
  height: "1em",
  width: "1em",
  cursor: "default"
});

export const arrowLeft = css({
  fill: "#515151",
  height: "1em",
  width: "1em",
  ":hover": {
    fill: "#ff9800b0"
  }
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
  marginTop: "0.8rem"
});

export const categorySteps = css({
  display: "flex",
  fontSize: "0.9rem",
  alignItems: "center",
  marginBottom: "1.2rem",
  justifyContent: "center"
});

export const step = css({
  color: "rgba(0, 0, 0, 0.6)",
  height: "1em",
  minWidth: "1em",
  margin: "0 0.4em",
  flexShrink: 0,
  cursor: "pointer",
  userSelect: "none",
  ":hover": {
    color: "#ff9800b0"
  }
});

export const stepEllipsis = cx(
  step,
  css({
    cursor: "default",
    userSelect: "none",
    ":hover": {
      color: "unset"
    }
  })
);

export const input = css({
  background: "none",
  height: "1.6em",
  width: "2.6em",
  margin: "0 0.4rem",
  border: "thin solid rgba(0, 0, 0, 0.12)",
  borderRadius: "4px",
  textAlign: "center",
  color: "rgba(0, 0, 0, 0.6)",
  // Get rid of the arrows at the end
  // This only works for Firefox
  appearance: "textfield",
  // This is for the other browsers
  "::-webkit-outer-spin-button, ::-webkit-inner-spin-button": {
    appearance: "none"
  },
  "::placeholder": {
    color: "rgba(0, 0, 0, 0.4)",
    textAlign: "center",
    // Firefox lowers the opacity for the placeholders, but that has already
    // been incorporated into the text colour, so that would double dip.
    opacity: 1
  }
});

export const visibility = css({
  position: "absolute",
  width: "1.2rem",
  height: "1.2rem",
  flexShrink: 0,
  top: 0,
  right: "0.4rem",
  cursor: "pointer"
});
