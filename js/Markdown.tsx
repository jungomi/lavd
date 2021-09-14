import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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

export type MarkdownDocument = {
  raw: string;
};

type Props = {
  data: DataMap;
  colours: ColourMap;
  names: Array<string>;
  hideName: (name: string) => void;
  categoryFilter?: RegExp;
};

export const Markdown: React.FC<Props> = ({
  data,
  colours,
  names,
  hideName,
  categoryFilter,
}) => {
  const kind = "markdown";
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
                          {(loadedData) => (
                            <div className="markdown-body">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {loadedData.raw}
                              </ReactMarkdown>
                            </div>
                          )}
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
  return cards.length === 0 ? (
    <Empty
      text={`${kind} ${
        categoryFilter === undefined ? "available" : "matching filter"
      }`}
    />
  ) : (
    <>{cards}</>
  );
};
