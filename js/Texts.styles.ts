import { css, cx } from "emotion";

const labelColour = "#616161";

export const text = css({
  fontSize: "1.5rem",
  display: "flex",
  justifyContent: "space-around"
});

export const column = css({
  display: "flex",
  flexDirection: "column",
  marginLeft: "1em",
  marginRight: "1em",
  // Needed to show trailing white space, otherwise they are not rendered.
  whiteSpace: "pre-wrap",
  maxWidth: "33%"
});

export const columnTitle = css({
  fontSize: "1rem",
  fontWeight: 500,
  color: labelColour,
  margin: "0 auto 0.8rem auto"
});

export const columnText = css({
  fontFamily: "monospace",
  display: "flex",
  flexWrap: "nowrap",
  alignItems: "center"
});

export const columnDiff = css({
  display: "flex",
  flexDirection: "column",
  flexWrap: "nowrap",
  // Show trailing spaces but don't wrap.
  whiteSpace: "pre",
  overflowX: "auto",
  overflowY: "hidden"
});

export const columnTextActual = cx(
  columnText,
  css({
    marginBottom: "0.2em"
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
