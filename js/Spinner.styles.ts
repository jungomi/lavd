import { css, keyframes } from "emotion";

const animation = keyframes({
  "0%": { transform: "scale(0)" },
  "100%": { transform: "scale(1.0)", opacity: 0 },
});

export const spinner = css({
  width: "2rem",
  height: "2rem",
  background: "grey",
  borderRadius: "50%",
  animation: `${animation} 1.0s infinite ease-in-out`,
});

export const loading = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
});

export const loadingSpinner = css({
  marginTop: "0.8rem",
});
