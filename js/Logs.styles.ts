import { css, cx } from "@emotion/css";
import { categoryCard } from "./Card.styles";
import { cssVars } from "./theme.styles";

export const logCard = cx(
  categoryCard,
  css({
    maxHeight: "80%",
    minWidth: "20rem",
    overflow: "hidden",
  })
);

export const tableContent = css({
  fontFamily: "monospace",
  // Render white space as is and don't break
  whiteSpace: "pre",
});

export const th = css({
  fontWeight: 500,
  color: cssVars.fg3,
  paddingBottom: "0.8rem",
  position: "sticky",
  top: 0,
  // Needs to be over the line numbers, which are also sticky.
  zIndex: 2,
  background: cssVars.bg,
});

export const td = css({
  padding: "0.1rem 0.8rem",
});

export const tr = css({
  ":hover": {
    background: cssVars.log.hover,
    "& > td": {
      "::before": {
        // When the row is hovered, the line number (::before pseudo element)
        // changes colour.
        color: cssVars.log.linenr.hover,
      },
    },
  },
});

export const lineNr = css({
  color: cssVars.log.linenr.text,
  textAlign: "right",
  position: "sticky",
  left: 0,
  paddingRight: "0.4rem",
  background: cssVars.bg,
  "::before": {
    // Show the line nr as ::before pseudo element
    content: "attr(data-line-nr)",
  },
});

export const time = cx(
  td,
  css({
    color: cssVars.log.timestamp,
    textAlign: "right",
  })
);
