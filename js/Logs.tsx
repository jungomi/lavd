import React from "react";
import { Colour, ColourMap, colourString } from "./colour/definition";
import * as imageStyles from "./Images.styles";
import * as styles from "./Logs.styles";
import { formatDate, parseDate, timeElapsed } from "./time";

type Optional<T> = T | undefined;

export type Log = {
  lines: Array<LogLine>;
};

export type Logs = {
  logs: {
    [name: string]: Optional<Log>;
  };
};
export type LogMap = Map<string, Logs>;

function sortedCategories(data: LogMap): Array<string> {
  const uniqueCategories: Set<string> = new Set();
  for (const d of data.values()) {
    for (const key of Object.keys(d.logs)) {
      uniqueCategories.add(key);
    }
  }
  return Array.from(uniqueCategories).sort();
}

type LogLineProps = {
  message: string;
  timestamp?: string;
  elapsed?: string;
  tag?: string;
  lineNr?: number;
  showColumn: {
    lineNr: boolean;
    timestamp: boolean;
    elapsed: boolean;
    tag: boolean;
  };
};

const LogLine: React.FC<LogLineProps> = ({
  message,
  timestamp,
  elapsed,
  tag,
  lineNr,
  showColumn
}) => {
  // Only columns are rendered that have at least one entry.
  return (
    <tr className={styles.tr}>
      {showColumn.lineNr && (
        // The line number is set as data-* attribute instead of as a child,
        // because it is used by CSS to create a ::before pseudo element. This
        // allows text selection without the line number.
        <td className={styles.lineNr} data-line-nr={lineNr}></td>
      )}
      {showColumn.timestamp && <td className={styles.time}>{timestamp}</td>}
      {showColumn.elapsed && <td className={styles.time}>{elapsed}</td>}
      {showColumn.tag && <td className={styles.td}>{tag}</td>}
      <td className={styles.td}>{message}</td>
    </tr>
  );
};

export type LogLine = {
  message: string;
  timestamp?: string;
  elapsed?: string;
  tag?: string;
  lineNr?: number;
};

export const Log: React.FC<Log> = ({ lines }) => {
  let start = undefined;
  const showColumn = {
    timestamp: false,
    elapsed: false,
    tag: false,
    lineNr: true
  };
  const logLines = [];
  for (const [i, line] of lines.entries()) {
    const currentLine: LogLine = { message: line.message, lineNr: i + 1 };
    if (line.timestamp) {
      const timestamp = parseDate(line.timestamp);
      if (timestamp) {
        currentLine.timestamp = formatDate(timestamp);
        showColumn.timestamp = true;
        // The start is set to the first timestamp that is encountered. This
        // allows to have some text before it, let's say a description.
        if (start === undefined) {
          start = timestamp;
        } else {
          currentLine.elapsed = timeElapsed(start, timestamp);
          showColumn.elapsed = true;
        }
      }
    }
    if (line.tag) {
      currentLine.tag = line.tag;
      showColumn.tag = true;
    }
    logLines.push(currentLine);
  }
  return (
    <div className={styles.log}>
      <table className={styles.table}>
        <thead>
          <tr>
            {showColumn.lineNr && <th className={styles.th}></th>}
            {showColumn.timestamp && <th className={styles.th}>Timestamp</th>}
            {showColumn.elapsed && <th className={styles.th}>Time Offset</th>}
            {showColumn.tag && <th className={styles.th}>Tag</th>}
            <th className={styles.th}>Message</th>
          </tr>
        </thead>
        <tbody className={styles.tableContent}>
          {logLines.map(line => (
            <LogLine
              {...line}
              showColumn={showColumn}
              key={`${line.lineNr}-${line.message}-${line.timestamp}-${line.tag}`}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

type LogCardProps = {
  category: string;
  name: string;
  log: Log;
  colour: Colour;
};

const LogCard: React.FC<LogCardProps> = ({ category, name, log, colour }) => {
  return (
    <div className={styles.logCard}>
      <div className={imageStyles.title}>
        <span className={imageStyles.category}>{category}</span>
        <span
          className={imageStyles.name}
          style={{ color: colourString(colour) }}
        >
          {name}
        </span>
      </div>
      <Log lines={log.lines} />
    </div>
  );
};

type LogCategoryProps = {
  category: string;
  data: LogMap;
  colourMap: ColourMap;
};

const LogCategory: React.FC<LogCategoryProps> = ({
  category,
  data,
  colourMap
}) => {
  const logCards = [];
  for (const [name, d] of data) {
    const log = d.logs[category];
    const colour = colourMap.get(name);
    if (log === undefined || colour === undefined) {
      continue;
    }
    logCards.push(
      <LogCard
        category={category}
        name={name}
        log={log}
        colour={colour}
        key={`${category}-${name}`}
      />
    );
  }
  return <>{logCards}</>;
};

type Props = {
  data: LogMap;
  colours: ColourMap;
};

export const Logs: React.FC<Props> = ({ data, colours }) => {
  const categories = sortedCategories(data);
  return (
    <>
      {categories.map(category => (
        <LogCategory
          category={category}
          data={data}
          colourMap={colours}
          key={category}
        />
      ))}
    </>
  );
};
