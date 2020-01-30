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
  "@media only screen and (min-width: 896px)": {
    fontSize: "1.3rem"
  }
});

export const column = css({
  display: "flex",
  flexDirection: "column",
  marginLeft: "0.3em",
  marginRight: "0.3em",
  width: "33%",
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
  justifyContent: "center",
  padding: "0.1em",
  // Needed to show trailing white space, otherwise they are not rendered.
  whiteSpace: "pre-wrap"
});

export const columnDiff = css({
  display: "flex",
  flexDirection: "column",
  flexWrap: "nowrap",
  // Show trailing spaces but don't wrap.
  whiteSpace: "pre",
  overflowX: "scroll",
  overflowY: "hidden",
  alignItems: "center"
});

export const columnTextActual = cx(
  columnText,
  css({
    overflow: "unset",
    justifyContent: "unset",
    marginBottom: "0.2em",
    whiteSpace: "unset"
  })
);

export const columnTextExpected = cx(
  columnText,
  css({
    overflow: "unset",
    justifyContent: "unset",
    whiteSpace: "unset"
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

export const diffContainer = css({
  margin: "auto"
});
