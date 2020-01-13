import React from "react";
import ReactMarkdown from "react-markdown";
import { Card } from "./Card";
import { ColourMap } from "./colour/definition";
import { DataMap, nonEmptyCategoryData, sortedCategories } from "./data";
import { Empty } from "./Empty";
import * as styles from "./Markdown.styles";

export type MarkdownDocument = {
  raw: string;
};

type Props = {
  data: DataMap;
  colours: ColourMap;
};

export const Markdown: React.FC<Props> = ({ data, colours }) => {
  const kind = "markdown";
  const categories = sortedCategories(data, kind);
  const cards = categories.map(category =>
    nonEmptyCategoryData(data, kind, category, colours).map(d => (
      <Card
        category={category}
        name={d.name}
        colour={d.colour}
        className={styles.markdownCard}
        key={`${category}-${d.name}`}
      >
        <div className="markdown-body">
          <ReactMarkdown source={d.data.raw} escapeHtml={false} />
        </div>
      </Card>
    ))
  );
  return cards.length === 0 ? <Empty text={kind} /> : <>{cards}</>;
};
