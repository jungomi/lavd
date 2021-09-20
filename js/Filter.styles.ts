import { css, cx } from "@emotion/css";
import * as commandStyles from "./Commands.styles";
import { cssVars } from "./theme.styles";

// Based on command styles
export const input = cx(
  commandStyles.input,
  css({ margin: "0 0.4rem", paddingRight: "1.3rem" })
);
export const inputInvalid = cx(input, css({ background: cssVars.error }));

export const inputContainer = cx(
  commandStyles.inputContainer,
  css({ marginTop: 0, marginBottom: "1rem" })
);
export const inputRemoveControls = commandStyles.inputRemoveControls;

export const cross = commandStyles.plus;
export const crossInvalid = cx(
  cross,
  css({
    "::before, ::after": {
      background: cssVars.fg2,
    },
  })
);
