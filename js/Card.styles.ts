import { css } from "emotion";
import { boxShadow } from "./colour/ColourPicker.styles";

const labelColour = "#616161";

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
  overflow: "scroll"
});

export const categoryCard = css({
  display: "flex",
  flexDirection: "column",
  marginBottom: "1rem",
  overflow: "hidden",
  maxHeight: "66vh"
});

export const title = css({
  fontSize: "1.1rem",
  marginBottom: "1rem"
});

export const categoryTitle = css({
  paddingBottom: "0.8rem",
  marginBottom: "0.8rem",
  borderBottom: "1px solid #eaecef"
});

export const category = css({
  fontWeight: 500,
  color: labelColour
});

export const name = css({
  fontStyle: "italic"
});
