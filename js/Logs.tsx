import React from "react";
import { Card, CategoryCard } from "./Card";
import { ColourMap } from "./colour/definition";
import { DataMap, sortObject, getDataKind } from "./data";
import { Empty } from "./Empty";
import * as styles from "./Logs.styles";
import { formatDate, parseDate, timeElapsed } from "./time";

export type Log = {
  lines: Array<LogLine>;
};

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

type Props = {
  data: DataMap;
  colours: ColourMap;
  names: Array<string>;
};

export const Logs: React.FC<Props> = ({ data, colours, names }) => {
  const kind = "logs";
  const cards = getDataKind(data, kind, names, colours).map(
    d =>
      d.data &&
      Object.keys(d.data).length && (
        <Card name={d.name} colour={d.colour} key={d.name}>
          {sortObject(d.data).map(({ key, value }) => (
            <CategoryCard category={key} key={key}>
              <Log lines={value.lines} />
            </CategoryCard>
          ))}
        </Card>
      )
  );
  return cards.length === 0 ? <Empty text={kind} /> : <>{cards}</>;
};
