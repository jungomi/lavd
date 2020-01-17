import React from "react";
import ReactMarkdown from "react-markdown";
import { Card, CategoryCard } from "./Card";
import { ColourMap } from "./colour/definition";
import { DataMap, sortObject, getDataKind } from "./data";
import { Empty } from "./Empty";

export type MarkdownDocument = {
  raw: string;
};

type Props = {
  data: DataMap;
  colours: ColourMap;
  names: Array<string>;
};

export const Markdown: React.FC<Props> = ({ data, colours, names }) => {
  const kind = "markdown";
  const cards = getDataKind(data, kind, names, colours).map(
    d =>
      d.data &&
      Object.keys(d.data).length && (
        <Card name={d.name} colour={d.colour} key={d.name}>
          {sortObject(d.data).map(({ key, value }) => (
            <CategoryCard
              category={key}
              /* className={styles.markdownCard} */
              key={key}
            >
              <div className="markdown-body">
                <ReactMarkdown source={value.raw} escapeHtml={false} />
              </div>
            </CategoryCard>
          ))}
        </Card>
      )
  );
  return cards.length === 0 ? <Empty text={kind} /> : <>{cards}</>;
};
