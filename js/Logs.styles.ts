import { css, cx } from "emotion";
import { bgColour } from "./App.styles";
import { imageCard } from "./Images.styles";

const labelColour = "#616161";

export const log = css({
  width: "100%",
  overflow: "auto"
});

export const logCard = cx(
  imageCard,
  css({
    maxHeight: "80%",
    overflow: "hidden"
  })
);

export const tableContent = css({
  fontFamily: "monospace",
  // Render white space as is and don't break
  whiteSpace: "pre"
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

export const td = css({
  padding: "0.1rem 0.8rem"
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

export const lineNr = css({
  color: "rgba(27, 31, 35, 0.3)",
  textAlign: "right",
  position: "sticky",
  left: 0,
  paddingRight: "0.4rem",
  background: bgColour,
  "::before": {
    // Show the line nr as ::before pseudo element
    content: "attr(data-line-nr)"
  }
});

export const time = cx(
  td,
  css({
    color: "#5f5f5f",
    textAlign: "right"
  })
);
