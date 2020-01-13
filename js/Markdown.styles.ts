import { css, cx } from "emotion";
import { card } from "./Card.styles";

export const markdownCard = cx(
  card,
  css({
    maxHeight: "80%",
    minWidth: "20rem",
    maxWidth: "65rem",
    overflow: "hidden"
  })
);
