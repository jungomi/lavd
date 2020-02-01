import { css, keyframes } from "emotion";
import React from "react";

const animation = keyframes({
  "0%": { transform: "scale(0)" },
  "100%": { transform: "scale(1.0)", opacity: 0 }
});

const spinnerClass = css({
  width: "2rem",
  height: "2rem",
  background: "grey",
  borderRadius: "50%",
  animation: `${animation} 1.0s infinite ease-in-out`
});

export const Spinner: React.FC = () => <div className={spinnerClass} />;
