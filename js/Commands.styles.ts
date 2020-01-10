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
    width: "50%"
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
  height: "1.6rem",
  border: "thin solid rgba(0, 0, 0, 0.12)",
  borderRadius: "4px",
  color: "rgba(0, 0, 0, 0.6)",
  paddingLeft: "0.6rem",
  paddingRight: "0.6rem",
  width: "100%",
  ":hover": {
    borderColor: "rgba(0, 0, 0, 0.36)"
  },
  ":focus": {
    // That's the default in Chrome, so other browsers now look the same.
    borderColor: "#469bde"
  }
});

export const checkbox = cx(
  input,
  css({
    width: "1.6rem",
    height: "1.6rem",
    appearance: "none",
    outline: "none",
    margin: 0,
    cursor: "pointer",
    borderRadius: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    transition: "all 0.2s ease-in-out",
    ":after": {
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
      ":after": {
        borderColor: "white",
        opacity: 1
      }
    }
  })
);
