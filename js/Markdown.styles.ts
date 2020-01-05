import { css, cx } from "emotion";
import { imageCard } from "./Images.styles";

export const markdownCard = cx(
  imageCard,
  css({
    maxHeight: "80%",
    maxWidth: "65rem",
    overflow: "hidden"
  })
);
