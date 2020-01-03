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
  marginRight: "2em",
  // Needed to show trailing white space, otherwise they are not rendered.
  whiteSpace: "pre-wrap"
});

export const columnTitle = css({
  fontSize: "1rem",
  fontWeight: 500,
  color: labelColour,
  margin: "0 auto 0.8rem auto"
});

export const columnText = css({
  fontFamily: "monospace"
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
