import { css, cx } from "emotion";
import * as commandStyles from "./Commands.styles";

// Based on command styles
export const input = cx(
  commandStyles.input,
  css({ margin: "0 0.4rem", paddingRight: "1.3rem" })
);
export const inputContainer = cx(
  commandStyles.inputContainer,
  css({ marginTop: 0, marginBottom: "1rem" })
);
export const inputRemoveControls = commandStyles.inputRemoveControls;
export const plus = commandStyles.plus;
