import { css, cx } from "emotion";
import { card } from "./Card.styles";

const labelColour = "#616161";

export const textCard = cx(
  card,
  css({
    maxHeight: "80%",
    minWidth: "20rem",
    overflow: "hidden"
  })
);

export const text = css({
  display: "flex",
  justifyContent: "space-around",
  "@media only screen and (min-width: 896px)": {
    fontSize: "1.3rem"
  }
});

export const column = css({
  display: "flex",
  flexDirection: "column",
  marginLeft: "0.3em",
  marginRight: "0.3em",
  // Needed to show trailing white space, otherwise they are not rendered.
  whiteSpace: "pre-wrap",
  maxWidth: "33%",
  overflow: "hidden"
});

export const columnTitle = css({
  display: "flex",
  justifyContent: "center",
  fontSize: "1rem",
  fontWeight: 500,
  color: labelColour,
  marginBottom: "0.8em"
});

export const columnText = css({
  fontFamily: "monospace",
  display: "flex",
  flexWrap: "nowrap",
  alignItems: "center",
  padding: "0.1em",
  overflow: "auto"
});

export const columnDiff = css({
  display: "flex",
  flexDirection: "column",
  flexWrap: "nowrap",
  // Show trailing spaces but don't wrap.
  whiteSpace: "pre",
  overflowX: "scroll",
  overflowY: "hidden"
});

export const columnTextActual = cx(
  columnText,
  css({
    overflow: "unset",
    marginBottom: "0.2em"
  })
);

export const columnTextExpected = cx(
  columnText,
  css({
    overflow: "unset"
  })
);

const diffChanges = css({
  display: "inline-block",
  borderRadius: "2px"
});

export const diffAdded = cx(
  diffChanges,
  css({
    background: "#97f295"
  })
);

export const diffRemoved = cx(
  diffChanges,
  css({
    background: "#ffb6ba"
  })
);
