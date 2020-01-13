import { css } from "emotion";
import React from "react";

const emptyClass = css({
  fontSize: "2rem",
  fontStyle: "italic",
  color: "#888",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "100%"
});

const smallEmptyClass = css({
  fontSize: "1.5rem",
  fontStyle: "italic",
  color: "#888",
  display: "flex",
  justifyContent: "center",
  width: "100%"
});

type Props = {
  text: string;
};

export const Empty: React.FC<Props> = ({ text }) => {
  return <div className={emptyClass}>No {text} available</div>;
};

export const SmallEmpty: React.FC<Props> = ({ text }) => {
  return <div className={smallEmptyClass}>No {text} available</div>;
};
