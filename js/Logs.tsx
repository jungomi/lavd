import React from "react";
import { Card, CategoryCard } from "./Card";
import { ColourMap } from "./colour/definition";
import {
  DataMap,
  getDataKind,
  sortedCategorySteps,
  sortedSteps,
  sortObject,
} from "./data";
import { DataLoader } from "./DataLoader";
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
  showColumn,
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
    lineNr: true,
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
    <table>
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
        {logLines.map((line) => (
          <LogLine
            {...line}
            showColumn={showColumn}
            key={`${line.lineNr}-${line.message}-${line.timestamp}-${line.tag}`}
          />
        ))}
      </tbody>
    </table>
  );
};

type Props = {
  data: DataMap;
  colours: ColourMap;
  names: Array<string>;
  hideName: (name: string) => void;
  categoryFilter?: RegExp;
};

export const Logs: React.FC<Props> = ({
  data,
  colours,
  names,
  hideName,
  categoryFilter,
}) => {
  const kind = "logs";
  const dataOfKind = getDataKind(data, kind, names, colours, categoryFilter);
  const cards = dataOfKind
    .map(
      (d) =>
        d.data &&
        Object.keys(d.data).length > 0 && (
          <Card
            name={d.name}
            hideName={hideName}
            colour={d.colour}
            steps={sortedSteps(d.data)}
            key={d.name}
          >
            {(selected) =>
              sortObject(d.data).map(({ key, value }) => (
                <CategoryCard
                  category={key}
                  steps={sortedCategorySteps(value)}
                  selectedStep={selected}
                  key={key}
                >
                  {(selectedCategory) => {
                    const selectedValue =
                      selectedCategory !== undefined && value.steps
                        ? value.steps[selectedCategory]
                        : value.global;
                    return (
                      selectedValue && (
                        <DataLoader data={selectedValue}>
                          {(loadedData) => <Log lines={loadedData.lines} />}
                        </DataLoader>
                      )
                    );
                  }}
                </CategoryCard>
              ))
            }
          </Card>
        )
    )
    .filter((c) => c);
  return cards.length === 0 ? <Empty text={kind} /> : <>{cards}</>;
};
