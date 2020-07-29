import { css, cx } from "emotion";
import React from "react";

const baseClass = css({
  display: "flex",
  justifyContent: "center",
  color: "#888",
  fontStyle: "italic",
  width: "100%",
});

const emptyClass = cx(
  baseClass,
  css({
    height: "100%",
    fontSize: "2rem",
    alignItems: "center",
  })
);

const smallEmptyClass = cx(baseClass, css({ fontSize: "1.5rem" }));

type Props = {
  text: string;
};

export const Empty: React.FC<Props> = ({ text }) => {
  return <div className={emptyClass}>No {text}</div>;
};

export const SmallEmpty: React.FC<Props> = ({ text }) => {
  return <div className={smallEmptyClass}>No {text}</div>;
};

export const EmptyDash: React.FC = () => {
  return <div className={baseClass}>—</div>;
};

export const EmptyLoading: React.FC = () => {
  return <div className={emptyClass}>Loading</div>;
};

export const SmallEmptyLoading: React.FC = () => {
  return <div className={smallEmptyClass}>Loading</div>;
};
