import React, { useState, useEffect } from "react";
import { Colour, colourString } from "./colour/definition";
import * as styles from "./Card.styles";
import { stringToInt } from "./number";

function padStepsStart(steps: Array<number>): Array<string> {
  let result: Array<string> = steps.map(s => s.toString());
  if (steps.length > 4) {
    result = [
      result[0],
      "…",
      result[steps.length - 2],
      result[steps.length - 1]
    ];
  } else if (steps.length < 4) {
    result = [...new Array(4 - steps.length).fill(""), ...result];
  }
  return result;
}

function padStepsEnd(steps: Array<number>): Array<string> {
  let result: Array<string> = steps.map(s => s.toString());
  if (steps.length > 4) {
    result = [result[0], result[1], "…", result[steps.length - 1]];
  } else if (steps.length < 4) {
    result = [...result, ...new Array(4 - steps.length).fill("")];
  }
  return result;
}

const Arrow: React.FC<{ disabled?: boolean; flip?: boolean }> = ({
  disabled,
  flip
}) => (
  <svg
    viewBox="0 0 32 32"
    className={
      flip
        ? disabled
          ? styles.arrowRightDisabled
          : styles.arrowRight
        : disabled
        ? styles.arrowLeftDisabled
        : styles.arrowLeft
    }
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7.701 14.276l9.586-9.585a2.267 2.267 0 013.195 0l.801.8a2.266 2.266 0 010 3.194L13.968 16l7.315 7.315a2.266 2.266 0 010 3.194l-.801.8a2.265 2.265 0 01-3.195 0l-9.586-9.587A2.24 2.24 0 017.054 16a2.248 2.248 0 01.647-1.724z" />
  </svg>
);

type StepSelectionProps = {
  steps: Array<number>;
  selected: number;
  setSelected: (step: number) => void;
  className?: string;
};

const StepSelection: React.FC<StepSelectionProps> = ({
  steps,
  selected,
  setSelected,
  className = styles.steps
}) => {
  const [inputValue, setInputValue] = useState("");
  const currentIndex = steps.indexOf(selected);
  const before = padStepsStart(steps.slice(0, currentIndex));
  const after = padStepsEnd(steps.slice(currentIndex + 1));
  const setNewSelected = (step?: number, resetInput?: boolean) => {
    if (step !== undefined && steps.includes(step)) {
      setSelected(step);
      if (resetInput) {
        setInputValue("");
      }
    }
  };
  return (
    <div className={className}>
      <span
        className={styles.step}
        onClick={() => {
          if (currentIndex !== 0) {
            setNewSelected(steps[currentIndex - 1], true);
          }
        }}
      >
        <Arrow disabled={currentIndex === 0} />
      </span>
      {before.map((s, i) => (
        <span
          className={s === "…" ? styles.stepEllipsis : styles.step}
          onClick={() => {
            const newValue = stringToInt(s);
            setNewSelected(newValue, true);
          }}
          key={`before-${s || `index-${i}`}`}
        >
          {s}
        </span>
      ))}
      <input
        type="number"
        placeholder={selected.toString()}
        value={inputValue}
        onChange={e => {
          const { value } = e.target;
          setInputValue(value);
          const newValue = stringToInt(value);
          setNewSelected(newValue);
        }}
        className={styles.input}
      />
      {after.map((s, i) => (
        <span
          className={s === "…" ? styles.stepEllipsis : styles.step}
          onClick={() => {
            const newValue = stringToInt(s);
            setNewSelected(newValue, true);
          }}
          key={`after-${s || `index-${i}`}`}
        >
          {s}
        </span>
      ))}
      <span
        className={styles.step}
        onClick={() => {
          if (currentIndex !== steps.length - 1) {
            setNewSelected(steps[currentIndex + 1], true);
          }
        }}
      >
        <Arrow flip={true} disabled={currentIndex === steps.length - 1} />
      </span>
    </div>
  );
};

type CardProps = {
  name: string;
  colour: Colour;
  steps?: Array<number>;
  className?: string;
  children?: (selected: number | undefined) => JSX.Element | Array<JSX.Element>;
};

export const Card: React.FC<CardProps> = ({
  name,
  colour,
  steps,
  className = styles.card,
  children
}) => {
  const initialStep =
    steps && steps.length ? steps[steps.length - 1] : undefined;
  const [selected, setSelected] = useState(initialStep);

  return (
    <div className={className}>
      <div className={styles.title}>
        <span className={styles.name} style={{ color: colourString(colour) }}>
          {name}
        </span>
        {selected !== undefined && steps && steps.length && (
          <StepSelection
            steps={steps}
            selected={selected}
            setSelected={setSelected}
          />
        )}
      </div>
      <div className={styles.content}>{children && children(selected)}</div>
    </div>
  );
};

type CategoryCardProps = {
  category: string;
  steps?: Array<number>;
  selectedStep?: number;
  contentClass?: string;
  children?: (
    selected: number | undefined
  ) => JSX.Element | Array<JSX.Element> | undefined;
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  steps,
  selectedStep,
  contentClass = styles.categoryContent,
  children
}) => {
  const initialStep =
    steps && steps.length
      ? selectedStep && steps.includes(selectedStep)
        ? selectedStep
        : steps[steps.length - 1]
      : undefined;
  const [selected, setSelected] = useState(initialStep);
  useEffect(() => {
    if (selectedStep !== undefined && steps && steps.includes(selectedStep)) {
      setSelected(selectedStep);
    }
  }, [steps, selectedStep]);

  return (
    <div className={styles.categoryCard}>
      <div className={styles.categoryTitle}>
        <span className={styles.category}>{category}</span>
      </div>
      {selected !== undefined && steps && steps.length && (
        <StepSelection
          steps={steps}
          selected={selected}
          setSelected={setSelected}
          className={styles.categorySteps}
        />
      )}
      <div className={contentClass}>{children && children(selected)}</div>
    </div>
  );
};
