import { css } from "@emotion/css";
import { cssVars } from "../theme.styles";

export const inputPanel = css({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-evenly",
  marginLeft: "0.8rem",
  marginBottom: "0.5rem",
});

export const inputField = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  font: "inherit",
  fontSize: "0.8rem",
});

export const inputSwitch = css({
  width: "28px",
  height: "28px",
  marginBottom: "0.8rem",
  marginRight: "0.8rem",
  cursor: "pointer",
  userSelect: "none",
  fill: cssVars.fg3,
  border: "2px solid transparent",
  borderRadius: "50%",
  ":hover": {
    background: cssVars.picker.switch.hover,
  },
  ":active": {
    background: cssVars.picker.switch.active,
  },
});

export const input = css({
  width: "90%",
  height: "1.9rem",
  border: `thin solid ${cssVars.input.border}`,
  borderRadius: "4px",
  textAlign: "center",
  color: cssVars.fg2,
});

export const label = css({
  color: cssVars.fg2,
  margin: "0.5rem 0",
});
