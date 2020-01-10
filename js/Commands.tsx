import React, { useState } from "react";
import {
  Colour,
  ColourMap,
  colourString,
  defaultColour
} from "./colour/definition";
import * as styles from "./Commands.styles";
import * as imageStyles from "./Images.styles";

type Optional<T> = T | undefined;

export type ParserOptionType = string | number | boolean;
export type ParserOptionTypeKind = "string" | "int" | "float" | "flag";

export type ParserOption = {
  short?: string;
  default?: ParserOptionType | Array<ParserOptionType>;
  description?: string;
  type?: ParserOptionTypeKind;
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
  options?: Map<string, ParserOptionValue>;
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

type InputProps = {
  name: string;
  value?: ParserOptionType | Array<ParserOptionType>;
  type?: ParserOptionTypeKind;
  setValue: (
    name: string,
    value: ParserOptionType | Array<ParserOptionType>
  ) => void;
};

const Input: React.FC<InputProps> = ({ name, value, type, setValue }) => {
  const inputs = [];
  const multipleValues = Array.isArray(value);
  // The array check needs to be done again, because TypeScript does not realise
  // that it's literally the same as multipleValues ? ... : [...]
  // decides it could be undefined.
  // The type system it just too narrow with special cases.
  //
  // An empty string is needed for empty values, because otherwise the inputs
  // become uncontrolled.
  const valueArr = Array.isArray(value)
    ? value
    : [value === undefined ? "" : value];
  const setNewValue = (newValue: ParserOptionType, index: number) => {
    if (multipleValues) {
      const newValues = [...valueArr];
      newValues[index] = newValue;
      setValue(name, newValues);
    } else {
      setValue(name, newValue);
    }
  };
  for (const [i, v] of valueArr.entries()) {
    const key = `${name}-${i}`;
    // NOTE: The value always respects the type that has been specified, so the
    // type casts (v as X) are just there to tell off TypeScript.
    switch (type) {
      case "int": {
        inputs.push(
          <div className={styles.inputContainer} key={key}>
            <input
              type="number"
              value={v as number | string}
              onChange={e => {
                const newValue = Number.parseInt(e.target.value);
                setNewValue(newValue, i);
              }}
              className={styles.input}
            />
          </div>
        );
        break;
      }
      case "float": {
        inputs.push(
          <div className={styles.inputContainer} key={key}>
            <input
              type="number"
              value={v as number | string}
              step={0.01}
              onChange={e => {
                const newValue = Number.parseFloat(e.target.value);
                setNewValue(newValue, i);
              }}
              className={styles.input}
            />
          </div>
        );
        break;
      }
      case "string": {
        inputs.push(
          <div className={styles.inputContainer} key={key}>
            <input
              type="text"
              value={v as string}
              onChange={e => setNewValue(e.target.value, i)}
              className={styles.input}
            />
          </div>
        );
        break;
      }
      case "flag": {
        inputs.push(
          <div className={styles.inputContainer} key={key}>
            <input
              type="checkbox"
              checked={Boolean(v)}
              onChange={() => setNewValue(!v, i)}
              className={styles.checkbox}
            />
          </div>
        );
        break;
      }
      default: {
      }
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
  value?: ParserOptionType | Array<ParserOptionType>;
  description?: string;
  type?: ParserOptionTypeKind;
  showColumn: {
    short: boolean;
    value: boolean;
    description: boolean;
  };
  setValue: (
    name: string,
    value: ParserOptionType | Array<ParserOptionType>
  ) => void;
};

const ParserOptionLine: React.FC<ParserOptionLineProps> = ({
  name,
  short,
  value,
  description,
  type,
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
        <Input name={name} value={value} setValue={setValue} type={type} />
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
  value?: ParserOptionType | Array<ParserOptionType>;
  description?: string;
  type?: ParserOptionTypeKind;
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
  const [optionsValues, setOptionsValues] = useState(
    initialOptionsValues(command)
  );
  // A copy map of the Map is created such that React re-renders it, since
  // mutating it won't change the reference and therefore won't trigger
  // a re-render.
  const setNewOptionValue = (
    name: string,
    value: ParserOptionType | Array<ParserOptionType>
  ) => {
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
        if (parserOpt.short) {
          currentOption.short = parserOpt.short;
          showColumn.short = true;
        }
        if (parserOpt.description) {
          currentOption.description = parserOpt.description;
          showColumn.description = true;
        }
        if (parserOpt.type) {
          currentOption.type = parserOpt.type;
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
