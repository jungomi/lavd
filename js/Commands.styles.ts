import { css, cx } from "emotion";
import { bgColour } from "./App.styles";
import { imageCard } from "./Images.styles";

const labelColour = "#616161";

export const commandCard = cx(
  imageCard,
  css({
    maxHeight: "80%",
    overflow: "hidden"
  })
);

export const commandPreview = css({
  display: "flex",
  fontFamily: "monospace",
  background: "#e5e5e56b",
  padding: "0.8rem",
  borderRadius: "2px",
  whiteSpace: "pre",
  overflow: "auto",
  "::before": {
    content: "'$'",
    marginRight: "0.8rem"
  }
});

export const optionsList = css({
  overflow: "scroll",
  marginTop: "1.0rem"
});

export const table = css({
  width: "100%"
});

export const th = css({
  fontWeight: 500,
  color: labelColour,
  paddingBottom: "0.8rem",
  position: "sticky",
  top: 0,
  // Needs to be over the line numbers, which are also sticky.
  zIndex: 2,
  background: bgColour
});

export const tr = css({
  ":hover": {
    background: "#ebebeb87",
    "& > td": {
      "::before": {
        // When the row is hovered, the line number (::before pseudo element)
        // changes colour.
        color: "rgba(27, 31, 35, 0.6)"
      }
    }
  }
});

export const td = css({
  padding: "0.2rem 0.4rem",
  verticalAlign: "middle",
  borderTop: "thin solid rgba(0, 0, 0, 0.12)",
  borderBottom: "thin solid rgba(0, 0, 0, 0.12)"
});

export const name = cx(
  td,
  css({
    fontFamily: "monospace",
    whiteSpace: "nowrap"
  })
);

export const shortName = cx(
  name,
  css({
    textAlign: "center"
  })
);

export const description = cx(
  td,
  css({
    color: "#5f5f5f"
  })
);

export const tdValues = cx(
  td,
  css({
    width: "50%",
    minWidth: "6rem"
  })
);

export const values = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center"
});

export const inputContainer = css({
  display: "flex",
  width: "100%",
  marginBottom: "0.2rem",
  marginTop: "0.2rem"
});

export const input = css({
  background: "none",
  // <input> automatically uses Arial, so make it the same font as the rest.
  font: "inherit",
  fontSize: "0.9rem",
  boxSizing: "border-box",
  height: "1.8rem",
  border: "thin solid rgba(0, 0, 0, 0.12)",
  borderRadius: "4px",
  color: "rgba(0, 0, 0, 0.6)",
  padding: "0 0.6rem",
  width: "100%",
  ":hover": {
    borderColor: "rgba(0, 0, 0, 0.36)"
  },
  ":focus": {
    // That's the default in Chrome, so other browsers now look the same.
    borderColor: "#469bde"
  },
  "::placeholder": {
    color: "rgba(0, 0, 0, 0.4)",
    textAlign: "center",
    // Firefox lowers the opacity for the placeholders, but that has already
    // been incorporated into the text colour, so that would double dip.
    opacity: 1
  }
});

export const checkbox = cx(
  input,
  css({
    width: "1.8rem",
    height: "1.8rem",
    appearance: "none",
    outline: "none",
    margin: 0,
    cursor: "pointer",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "all 0.2s ease-in-out",
    "::after": {
      content: "''",
      flexShrink: 0,
      // Small rectangle with a border to create an L shape
      width: "0.3rem",
      height: "0.6rem",
      borderStyle: "solid",
      borderWidth: "0 3px 3px 0",
      // Rotate the L to look like a checkmark
      transform: "rotate(45deg)",
      opacity: 0.2,
      transition: "all 0.2s linear"
    },
    ":checked": {
      background: "#5cb85c",
      "::after": {
        borderColor: "white",
        opacity: 1
      }
    }
  })
);

export const selectContainer = css({
  display: "flex",
  alignItems: "center",
  position: "relative",
  fontSize: "0.9rem",
  width: "100%",
  "::before": {
    content: "attr(data-placeholder)",
    position: "absolute",
    display: "flex",
    justifyContent: "center",
    width: "100%",
    pointerEvents: "none",
    color: "rgba(0, 0, 0, 0.4)"
  },
  "::after": {
    content: "''",
    position: "absolute",
    right: "0.8rem",
    flexShrink: 0,
    width: "0.4rem",
    height: "0.4rem",
    color: "rgba(0, 0, 0, 0.6)",
    borderStyle: "solid",
    borderWidth: "0 2px 2px 0",
    // Rotate to make it point down
    transform: "rotate(45deg)",
    // All mouse events are passed through the element below it.
    pointerEvents: "none"
  }
});

export const select = cx(
  input,
  css({
    outline: "none",
    appearance: "none",
    cursor: "pointer"
  })
);
