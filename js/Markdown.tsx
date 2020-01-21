import React from "react";
import ReactMarkdown from "react-markdown";
import { Card, CategoryCard } from "./Card";
import { ColourMap } from "./colour/definition";
import {
  DataMap,
  getDataKind,
  sortedCategorySteps,
  sortedSteps,
  sortObject
} from "./data";
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
  const dataOfKind = getDataKind(data, kind, names, colours);
  const cards = dataOfKind.map(
    d =>
      d.data &&
      Object.keys(d.data).length && (
        <Card
          name={d.name}
          colour={d.colour}
          steps={sortedSteps(d.data)}
          key={d.name}
        >
          {selected =>
            sortObject(d.data).map(({ key, value }) => (
              <CategoryCard
                category={key}
                steps={sortedCategorySteps(value)}
                selectedStep={selected}
                key={key}
              >
                {selectedCategory => {
                  const selectedValue =
                    selectedCategory && value.steps
                      ? value.steps[selectedCategory]
                      : value.global;
                  return (
                    selectedValue && (
                      <div className="markdown-body">
                        <ReactMarkdown
                          source={selectedValue.raw}
                          escapeHtml={false}
                        />
                      </div>
                    )
                  );
                }}
              </CategoryCard>
            ))
          }
        </Card>
      )
  );
  return cards.length === 0 ? <Empty text={kind} /> : <>{cards}</>;
};
