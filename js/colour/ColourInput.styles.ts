import { css } from "emotion";

export const inputPanel = css({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-evenly",
  marginLeft: "0.8rem",
  marginBottom: "0.5rem"
});

export const inputField = css({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  font: "inherit",
  fontSize: "0.8rem"
});

export const inputSwitch = css({
  width: "24px",
  height: "24px",
  marginBottom: "0.8rem",
  marginRight: "0.8rem",
  cursor: "pointer",
  userSelect: "none",
  border: "2px solid transparent",
  borderRadius: "50%",
  ":hover": {
    background: "rgba(0, 0, 0, 0.06)"
  },
  ":active": {
    background: "rgba(0, 0, 0, 0.12)"
  }
});

export const input = css({
  width: "80%",
  height: "1.6rem",
  border: "thin solid rgba(0, 0, 0, 0.12)",
  borderRadius: "4px",
  textAlign: "center",
  color: "rgba(0, 0, 0, 0.6)"
});

export const label = css({
  color: "rgba(0, 0, 0, 0.6)",
  margin: "0.5rem 0"
});
