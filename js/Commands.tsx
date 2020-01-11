import React, { useState } from "react";
import {
  Colour,
  ColourMap,
  colourString,
  defaultColour
} from "./colour/definition";
import * as styles from "./Commands.styles";
import * as imageStyles from "./Images.styles";
import { stringToFloat, stringToInt } from "./number";

type Optional<T> = T | undefined;

export type ParserOptionType = string | number | boolean;
export type ParserOptionTypeKind = "string" | "int" | "float" | "flag";

export type ParserOption = {
  short?: string;
  default?: ParserOptionType | Array<ParserOptionType>;
  description?: string;
  type?: ParserOptionTypeKind;
  choices?: Array<ParserOptionType>;
};

type ParserOptionValue = Optional<ParserOptionType | Array<ParserOptionType>>;

export type Arguments = {
  positional?: Array<string>;
  options?: {
    [name: string]: ParserOptionValue;
  };
};

export type Parser = {
  [name: string]: Optional<ParserOption>;
};

export type Command = {
  bin?: string;
  arguments?: Arguments;
  parser?: Parser;
};

export type Commands = {
  command: Command;
};

export type CommandMap = Map<string, Commands>;

type CommandPreviewProps = {
  bin?: string;
  positional?: Array<string>;
  options?: Map<string, OptionalParserOption>;
};

const CommandPreview: React.FC<CommandPreviewProps> = ({
  bin,
  positional,
  options
}) => {
  const argSpans = [];
  if (positional) {
    for (const posArg of positional) {
      argSpans.push(<span key={posArg}>{posArg} </span>);
    }
  }
  if (options) {
    const sortedKeys = Array.from(options.keys()).sort();
    for (const key of sortedKeys) {
      const value = options.get(key);
      let valueText = Array.isArray(value) ? value.join(" ") : value;
      if (
        value === undefined ||
        (Array.isArray(value) && value.every(v => v === undefined))
      ) {
        continue;
      }
      // When it's a boolean value, it's a flag.
      // If it's true, the flag is set, but without any value.
      // If it's false, it should not be listed at all.
      if (typeof value === "boolean") {
        if (value) {
          valueText = undefined;
        } else {
          continue;
        }
      }
      argSpans.push(
        <span key={key}>
          --{key} {valueText && <>{valueText} </>}
        </span>
      );
    }
  }
  return (
    <pre className={styles.commandPreview}>
      <code>
        {bin && <span>{bin} </span>}
        <>{argSpans}</>
      </code>
    </pre>
  );
};

type OptionalParserOption =
  | ParserOptionType
  | Array<ParserOptionType | undefined>
  | undefined;

type InputProps = {
  name: string;
  value?: OptionalParserOption;
  type?: ParserOptionTypeKind;
  choices?: Array<ParserOptionType>;
  setValue: (name: string, value: OptionalParserOption) => void;
};

const Input: React.FC<InputProps> = ({
  name,
  value,
  type,
  choices,
  setValue
}) => {
  const inputs = [];
  // An empty string is needed for empty values, because otherwise the inputs
  // become uncontrolled.
  const valueArr = Array.isArray(value) ? value : [value];
  const choiceStrs =
    choices !== undefined && choices.length > 0
      ? choices.map(c => c.toString())
      : undefined;
  const inputValues = valueArr.map(v => (v === undefined ? "" : v));
  const setNewValue = (
    newValue: ParserOptionType | undefined,
    index: number
  ) => {
    if (Array.isArray(value)) {
      const newValues = [...value];
      newValues[index] = newValue;
      setValue(name, newValues);
    } else {
      setValue(name, newValue);
    }
  };
  for (const [i, val] of inputValues.entries()) {
    const key = `${name}-${i}`;
    let input = undefined;
    // NOTE: The value always respects the type that has been specified, so the
    // type casts (val as X) are just there to tell off TypeScript.
    if (choiceStrs) {
      input = (
        <div className={styles.selectContainer}>
          <select
            value={val.toString()}
            onChange={e => {
              setNewValue(e.target.value, i);
            }}
            className={styles.select}
          >
            {choiceStrs.map(c => (
              <option value={c} key={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      );
    } else {
      switch (type) {
        case "int": {
          input = (
            <input
              type="number"
              value={val as number | string}
              onChange={e => {
                const newValue = stringToInt(e.target.value);
                setNewValue(newValue, i);
              }}
              className={styles.input}
            />
          );
          break;
        }
        case "float": {
          input = (
            <input
              type="number"
              value={val as number | string}
              step={0.01}
              onChange={e => {
                const newValue = stringToFloat(e.target.value);
                setNewValue(newValue, i);
              }}
              className={styles.input}
            />
          );
          break;
        }
        case "string": {
          input = (
            <input
              type="text"
              value={val as string}
              onChange={e => {
                // When the input is empty, it needs to be unset.
                const newValue =
                  e.target.value === "" ? undefined : e.target.value;
                setNewValue(newValue, i);
              }}
              className={styles.input}
            />
          );
          break;
        }
        case "flag": {
          input = (
            <input
              type="checkbox"
              checked={Boolean(val)}
              onChange={() => setNewValue(!val, i)}
              className={styles.checkbox}
            />
          );
          break;
        }
      }
    }
    if (input !== undefined) {
      inputs.push(
        <div className={styles.inputContainer} key={key}>
          {" "}
          {input}{" "}
        </div>
      );
    }
  }
  return (
    <td className={styles.tdValues}>
      <div className={styles.values}>{inputs}</div>
    </td>
  );
};

type ParserOptionLineProps = {
  name: string;
  short?: string;
  value?: OptionalParserOption;
  description?: string;
  type?: ParserOptionTypeKind;
  choices?: Array<ParserOptionType>;
  showColumn: {
    short: boolean;
    value: boolean;
    description: boolean;
  };
  setValue: (name: string, value: OptionalParserOption) => void;
};

const ParserOptionLine: React.FC<ParserOptionLineProps> = ({
  name,
  short,
  value,
  description,
  type,
  choices,
  showColumn,
  setValue
}) => {
  // Only columns are rendered that have at least one entry.
  return (
    <tr className={styles.tr}>
      <td className={styles.name}>--{name}</td>
      {showColumn.short && (
        <td className={styles.shortName}>{short && <>-{short}</>}</td>
      )}
      {showColumn.value && (
        <Input
          name={name}
          value={value}
          setValue={setValue}
          type={type}
          choices={choices}
        />
      )}
      {showColumn.description && (
        <td className={styles.description}>{description}</td>
      )}
    </tr>
  );
};

type CurrentParserOption = {
  name: string;
  short?: string;
  value?: OptionalParserOption;
  description?: string;
  type?: ParserOptionTypeKind;
  choices?: Array<ParserOptionType>;
};

type CommandCardProps = {
  name: string;
  command: Command;
  colour: Colour;
};

function initialOptionsValues(
  command: Command
): Map<string, ParserOptionValue> {
  const initialValues = new Map();
  if (command.parser) {
    for (const [key, value] of Object.entries(command.parser)) {
      if (value && value.default) {
        initialValues.set(key, value.default);
      }
    }
  }
  // Overwrite the defaults (if any) with the actual given values.
  if (command.arguments && command.arguments.options) {
    for (const [key, value] of Object.entries(command.arguments.options)) {
      initialValues.set(key, value);
    }
  }
  return initialValues;
}

const CommandCard: React.FC<CommandCardProps> = ({ name, command, colour }) => {
  const [optionsValues, setOptionsValues] = useState<
    Map<string, OptionalParserOption>
  >(initialOptionsValues(command));
  // A copy map of the Map is created such that React re-renders it, since
  // mutating it won't change the reference and therefore won't trigger
  // a re-render.
  const setNewOptionValue = (name: string, value: OptionalParserOption) => {
    setOptionsValues(new Map(optionsValues.set(name, value)));
  };

  const showColumn = {
    short: false,
    value: false,
    description: false
  };
  const parserOptions = [];
  if (command.parser) {
    const sortedKeys = Object.keys(command.parser).sort();
    for (const key of sortedKeys) {
      const parserOpt = command.parser[key];
      const currentOption: CurrentParserOption = { name: key };
      if (parserOpt) {
        currentOption.type = parserOpt.type;
        currentOption.choices = parserOpt.choices;
        if (parserOpt.short) {
          currentOption.short = parserOpt.short;
          showColumn.short = true;
        }
        if (parserOpt.description) {
          currentOption.description = parserOpt.description;
          showColumn.description = true;
        }
        const value = optionsValues.get(key);
        if (value !== undefined) {
          currentOption.value = value;
          showColumn.value = true;
        }
      }
      parserOptions.push(currentOption);
    }
  }
  const positional = command.arguments && command.arguments.positional;
  return (
    <div className={styles.commandCard}>
      <div className={imageStyles.title}>
        <span
          className={imageStyles.name}
          style={{ color: colourString(colour) }}
        >
          {name}
        </span>
      </div>
      {(command.bin || positional || optionsValues.size > 0) && (
        <CommandPreview
          bin={command.bin}
          positional={positional}
          options={optionsValues}
        />
      )}
      {command.parser && (
        <div className={styles.optionsList}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.tr}>
                <th className={styles.th}>Name</th>
                {showColumn.short && <th className={styles.th}>Short Name</th>}
                {showColumn.value && <th className={styles.th}>Value</th>}
                {showColumn.description && (
                  <th className={styles.th}>Description</th>
                )}
              </tr>
            </thead>
            <tbody>
              {parserOptions.map(opt => (
                <ParserOptionLine
                  {...opt}
                  showColumn={showColumn}
                  setValue={setNewOptionValue}
                  key={opt.name}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

type Props = {
  data: CommandMap;
  colours: ColourMap;
};

export const Commands: React.FC<Props> = ({ data, colours }) => {
  return (
    <>
      {Array.from(data.entries()).map(([name, { command }]) => {
        const colour = colours.get(name) || defaultColour;
        return (
          <CommandCard
            name={name}
            command={command}
            colour={colour}
            key={name}
          />
        );
      })}
    </>
  );
};
