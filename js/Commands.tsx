import React, { useEffect, useRef, useState } from "react";
import { Card } from "./Card";
import { Colour, ColourMap } from "./colour/definition";
import * as styles from "./Commands.styles";
import { DataMap, getDataKind, Optional } from "./data";
import { Empty } from "./Empty";
import { stringToFloat, stringToInt } from "./number";

export type ParserOptionType = string | number | boolean;
export type ParserOptionTypeKind = "string" | "int" | "float" | "flag";

type ArgumentCount = "+" | number;

export type ParserOption = {
  short?: string;
  default?: ParserOptionType | Array<ParserOptionType>;
  description?: string;
  type?: ParserOptionTypeKind;
  count?: ArgumentCount;
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

function optionsToString(opt: OptionalParserOption): string {
  if (opt === undefined) {
    return "";
  } else if (Array.isArray(opt)) {
    return opt.map(optionsToString).join(" ");
  } else {
    const optStr = opt.toString();
    if (optStr.startsWith('"')) {
      // When the option starts with a double quote, the user is solely
      // responsible to close the quotes and escape all special characters.
      // This allows to have shell expression to be evaluated within the string,
      // which would not be possible with single quotes.
      return optStr;
    } else if (/[^\\] /.test(optStr)) {
      // Quote with single quotes if there it contains a space.
      // Since it's wrapped in single quotes, all single quotes need to be
      // escaped with '\'' (literally)
      return `'${optStr.replace(/'/g, "'\\''")}'`;
    } else {
      return optStr;
    }
  }
}

function isOptionComplete(
  name: string,
  opt: OptionalParserOption,
  counts: Map<string, number> | undefined
): boolean {
  if (opt === undefined) {
    return false;
  } else if (Array.isArray(opt)) {
    // When it's a fixed count, all values need to exist, otherwise it's enough
    // if it's just one.
    if (counts && counts.get(name)) {
      return opt.every(o => o !== undefined);
    } else {
      return opt.some(o => o !== undefined);
    }
  }
  return true;
}

// Completes lists of values with their respetive defaults.
// Since values with a count must have all of the values to be rednered, it is
// acceptable to fill in the missing values with their defaults as long as at
// least one had been specified.
function completePartialsWithDefaults(
  name: string,
  opt: OptionalParserOption,
  defaults?: Map<string, ParserOptionType | Array<ParserOptionType>> | undefined
): OptionalParserOption {
  if (
    defaults !== undefined &&
    opt !== undefined &&
    Array.isArray(opt) &&
    opt.some(o => o !== undefined)
  ) {
    const defaultValue = defaults.get(name);
    if (defaultValue !== undefined) {
      return opt.map((o, i) => {
        if (o === undefined) {
          return Array.isArray(defaultValue) ? defaultValue[i] : defaultValue;
        } else {
          return o;
        }
      });
    }
  }
  return opt;
}

type CommandPreviewProps = {
  bin?: string;
  positional?: Array<string>;
  options?: Map<string, OptionalParserOption>;
  counts?: Map<string, number>;
  defaults?: Map<string, ParserOptionType | Array<ParserOptionType>>;
};

const CommandPreview: React.FC<CommandPreviewProps> = ({
  bin,
  positional,
  options,
  counts,
  defaults
}) => {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);
  const argSpans = [];
  let commandString = bin === undefined ? "" : `${bin} `;
  if (positional) {
    for (const posArg of positional) {
      argSpans.push(<span key={posArg}>{posArg} </span>);
      commandString += `${posArg} `;
    }
  }
  if (options) {
    const sortedKeys = Array.from(options.keys()).sort();
    for (const key of sortedKeys) {
      const value = completePartialsWithDefaults(
        key,
        options.get(key),
        defaults
      );
      let valueText: string | undefined = optionsToString(value);
      if (!isOptionComplete(key, value, counts)) {
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
      commandString += `--${key} `;
      if (valueText !== undefined) {
        commandString += `${valueText} `;
      }
    }
  }
  return (
    <div className={styles.commandPreview}>
      <pre className={styles.commandPreviewCode}>
        <code>
          {bin && <span>{bin} </span>}
          <>{argSpans}</>
        </code>
      </pre>
      {navigator.clipboard && (
        <div
          className={copied ? styles.copySuccess : styles.copy}
          onClick={e => {
            e.preventDefault();
            navigator.clipboard
              .writeText(commandString)
              .then(() => setCopied(true))
              .catch(e => console.error(e));
          }}
        >
          <div className={copied ? styles.copyIconSuccess : styles.copyIcon} />
        </div>
      )}
    </div>
  );
};

type OptionalParserOption =
  | ParserOptionType
  | Array<ParserOptionType | undefined>
  | undefined;

type InputProps = {
  index: number;
  count?: ArgumentCount;
  value: ParserOptionType;
  placeholder: string;
  setValue: (newValue: ParserOptionType | undefined, index: number) => void;
  destroy: (index: number, backward?: boolean) => void;
  type?: ParserOptionTypeKind;
  choices?: Array<string>;
  focus?: boolean;
  finishFocus: () => void;
  addInput: (at?: number) => void;
};

const Input: React.FC<InputProps> = ({
  index,
  count,
  value,
  type,
  placeholder,
  choices,
  setValue,
  destroy,
  focus,
  finishFocus,
  addInput
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (focus && inputRef.current !== null) {
      inputRef.current.focus();
      // After it has been focused, the parent needs to know that it's done to
      // reset the focus value, otherwise if the same index is focused again,
      // it will not trigger a new focus.
      finishFocus();
    }
  }, [focus, finishFocus]);
  // When Enter is pressed on the inputs that allow adding new fields, it will
  // create signal to create a new input field.
  const pressEnter = (e: React.KeyboardEvent) => {
    if (count === "+") {
      if (e.key === "Enter") {
        addInput(index);
      } else if (e.key === "Backspace" && value === "") {
        destroy(index, true);
      }
    }
  };
  let input = undefined;
  // NOTE: The value always respects the type that has been specified, so the
  // type casts (val as X) are just there to tell off TypeScript.
  if (choices) {
    // select doesn't have placeholder, to work around that a ::before pseudo
    // element is used to show the placeholder with a data attribute.
    input = (
      <div
        data-placeholder={value === "" ? placeholder : ""}
        className={styles.selectContainer}
      >
        <select
          value={value.toString()}
          onChange={e => {
            const newValue = e.target.value === "" ? undefined : e.target.value;
            setValue(newValue, index);
          }}
          className={styles.select}
        >
          <option value="" />
          {choices.map(c => (
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
            value={value as number | string}
            placeholder={placeholder}
            onChange={e => {
              const newValue = stringToInt(e.target.value);
              setValue(newValue, index);
            }}
            className={count === "+" ? styles.inputWithCount : styles.input}
            onKeyDown={pressEnter}
            ref={inputRef}
          />
        );
        break;
      }
      case "float": {
        input = (
          <input
            type="number"
            value={value as number | string}
            placeholder={placeholder}
            step={0.01}
            onChange={e => {
              const newValue = stringToFloat(e.target.value);
              setValue(newValue, index);
            }}
            className={count === "+" ? styles.inputWithCount : styles.input}
            onKeyDown={pressEnter}
            ref={inputRef}
          />
        );
        break;
      }
      case "string": {
        input = (
          <input
            type="text"
            value={value as string}
            placeholder={placeholder}
            onChange={e => {
              // When the input is empty, it needs to be unset.
              const newValue =
                e.target.value === "" ? undefined : e.target.value;
              setValue(newValue, index);
            }}
            className={count === "+" ? styles.inputWithCount : styles.input}
            onKeyDown={pressEnter}
            ref={inputRef}
          />
        );
        break;
      }
      case "flag": {
        input = (
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={() => setValue(!value, index)}
            className={styles.checkbox}
          />
        );
        break;
      }
    }
  }
  if (input === undefined) {
    return null;
  } else {
    return (
      <div className={styles.inputContainer}>
        {input}
        {count === "+" && (
          <div
            className={styles.inputRemoveControls}
            onClick={() => destroy(index)}
          >
            <span className={styles.plus}></span>
          </div>
        )}
      </div>
    );
  }
};

type InputListProps = {
  name: string;
  value?: OptionalParserOption;
  defaultValue?: ParserOptionType | Array<ParserOptionType>;
  type?: ParserOptionTypeKind;
  choices?: Array<ParserOptionType>;
  count?: ArgumentCount;
  setValue: (name: string, value: OptionalParserOption) => void;
};

const InputList: React.FC<InputListProps> = ({
  name,
  value,
  defaultValue,
  type,
  choices,
  count,
  setValue
}) => {
  const [focused, setFocused] = useState<number | undefined>(undefined);
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
  const addInput = (at?: number) => {
    if (Array.isArray(value)) {
      // When an index is given, the input field will be created after that
      // given index, otherwise at the very end.
      const newIndex = at === undefined ? value.length : at + 1;
      const newValue = [
        ...value.slice(0, newIndex),
        undefined,
        ...value.slice(newIndex)
      ];
      setValue(name, newValue);
      // The new input will be focused.
      setFocused(newIndex);
    }
  };
  const removeInput = (index: number, backward: boolean = false) => {
    if (Array.isArray(value)) {
      const newValue = [...value.slice(0, index), ...value.slice(index + 1)];
      if (newValue.length === 0) {
        newValue.push(undefined);
      }
      setValue(name, newValue);
      // Depending on whether the X has been clicked or the Backspace key is
      // pressed on an empty input, a different focus is expectd.
      // When clicking on the X the input under the cursor should be focused,
      // which is the input that moved one up, unless the removed one was the
      // last one in the list, in which the previous one will be focused.
      // When pressing the Backspace key, the previous input should be focused,
      // or if it was the first one, it will remain on the now new first one,
      // that just moved up.
      const focusIndex = backward
        ? Math.max(0, index - 1)
        : Math.min(index, newValue.length - 1);
      setFocused(focusIndex);
    }
  };
  const resetFocused = () => setFocused(undefined);
  for (const [i, val] of inputValues.entries()) {
    const key = `${name}-${i}`;
    const currentDefault = Array.isArray(defaultValue)
      ? defaultValue[i]
      : defaultValue;
    const placeholder =
      currentDefault === undefined
        ? ""
        : `Default: ${currentDefault.toString()}`;
    const input = (
      <Input
        index={i}
        count={count}
        value={val}
        type={type}
        placeholder={placeholder}
        choices={choiceStrs}
        setValue={setNewValue}
        destroy={removeInput}
        focus={focused === i}
        finishFocus={resetFocused}
        addInput={addInput}
        key={key}
      />
    );
    if (input !== null) {
      inputs.push(input);
    }
  }
  return (
    <td className={styles.tdValues}>
      <div className={styles.values}>
        {inputs}
        {count === "+" && (
          <div className={styles.addInput} onClick={() => addInput()} />
        )}
      </div>
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
  count?: ArgumentCount;
  defaults?: Map<string, ParserOptionType | Array<ParserOptionType>>;
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
  count,
  defaults,
  showColumn,
  setValue
}) => {
  const defaultValue = defaults && defaults.get(name);
  // Only columns are rendered that have at least one entry.
  return (
    <tr className={styles.tr}>
      <td className={styles.name}>--{name}</td>
      {showColumn.short && (
        <td className={styles.shortName}>{short && <>-{short}</>}</td>
      )}
      {showColumn.value && (
        <InputList
          name={name}
          value={value}
          defaultValue={defaultValue}
          setValue={setValue}
          type={type}
          choices={choices}
          count={count}
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
  count?: ArgumentCount;
};

type CommandOptions = {
  values: Map<string, OptionalParserOption>;
  defaults?: Map<string, ParserOptionType | Array<ParserOptionType>>;
  counts?: Map<string, number>;
};

function initialCommandOptions(command: Command): CommandOptions {
  const values = new Map();
  const defaults = new Map();
  const exactCounts = new Map();
  if (command.parser) {
    for (const [key, value] of Object.entries(command.parser)) {
      if (value !== undefined) {
        if (value.default !== undefined) {
          defaults.set(key, value.default);
        }
        if (typeof value.count === "number") {
          exactCounts.set(key, value.count);
        }
      }
    }
  }
  // Overwrite the defaults (if any) with the actual given values.
  if (command.arguments && command.arguments.options) {
    for (const [key, value] of Object.entries(command.arguments.options)) {
      values.set(key, value);
    }
  }
  // Values that have exact counts need to have the exact number of values even
  // if they were not yet specified.
  for (const [key, count] of exactCounts.entries()) {
    let value = values.get(key);
    if (value === undefined) {
      value = new Array(count).fill(undefined);
    } else if (Array.isArray(value)) {
      const padLength = count - value.length;
      if (padLength > 0) {
        value = [...value, ...new Array(padLength).fill(undefined)];
      }
    }
    values.set(key, value);
  }
  return {
    values,
    defaults: defaults.size > 0 ? defaults : undefined,
    counts: exactCounts
  };
}

type CommandCardProps = {
  name: string;
  command: Command;
  colour: Colour;
  hideName: (name: string) => void;
};

const CommandCard: React.FC<CommandCardProps> = ({
  name,
  command,
  colour,
  hideName
}) => {
  const commandOptions = initialCommandOptions(command);
  const [optionsValues, setOptionsValues] = useState(commandOptions.values);
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
  const parserOptions: Array<CurrentParserOption> = [];
  if (command.parser) {
    const sortedKeys = Object.keys(command.parser).sort();
    for (const key of sortedKeys) {
      const parserOpt = command.parser[key];
      const currentOption: CurrentParserOption = { name: key };
      if (parserOpt) {
        currentOption.type = parserOpt.type;
        currentOption.choices = parserOpt.choices;
        currentOption.count = parserOpt.count;
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
    <Card
      name={name}
      hideName={hideName}
      colour={colour}
      className={
        command.parser ? styles.commandCardWithParser : styles.commandCard
      }
    >
      {() => (
        <>
          {(command.bin || positional || optionsValues.size > 0) && (
            <CommandPreview
              bin={command.bin}
              positional={positional}
              options={optionsValues}
              counts={commandOptions.counts}
              defaults={commandOptions.defaults}
            />
          )}
          {command.parser && (
            <div className={styles.optionsList}>
              <table className={styles.table}>
                <thead>
                  <tr className={styles.tr}>
                    <th className={styles.th}>Name</th>
                    {showColumn.short && (
                      <th className={styles.th}>Short Name</th>
                    )}
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
                      defaults={commandOptions.defaults}
                      showColumn={showColumn}
                      setValue={setNewOptionValue}
                      count={opt.count}
                      key={opt.name}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

type Props = {
  data: DataMap;
  colours: ColourMap;
  names: Array<string>;
  hideName: (name: string) => void;
};

export const Commands: React.FC<Props> = ({
  data,
  colours,
  names,
  hideName
}) => {
  const kind = "command";
  const cards = getDataKind(data, kind, names, colours).map(
    d =>
      d.data && (
        <CommandCard
          name={d.name}
          hideName={hideName}
          command={d.data}
          colour={d.colour}
          key={d.name}
        />
      )
  );
  return cards.length === 0 ? <Empty text="commands" /> : <>{cards}</>;
};
