import React from "react";
import ReactMarkdown from "react-markdown";
import { Colour, ColourMap, colourString } from "./colour/definition";
import * as imageStyles from "./Images.styles";
import * as styles from "./Markdown.styles";

type Optional<T> = T | undefined;

export type MarkdownDocument = {
  raw: string;
};

export type MarkdownDocuments = {
  markdown: {
    [name: string]: Optional<MarkdownDocument>;
  };
};
export type MarkdownMap = Map<string, MarkdownDocuments>;

function sortedCategories(data: MarkdownMap): Array<string> {
  const uniqueCategories: Set<string> = new Set();
  for (const d of data.values()) {
    for (const key of Object.keys(d.markdown)) {
      uniqueCategories.add(key);
    }
  }
  return Array.from(uniqueCategories).sort();
}

type MarkdownCardProps = {
  category: string;
  name: string;
  markdown: MarkdownDocument;
  colour: Colour;
};

const MarkdownCard: React.FC<MarkdownCardProps> = ({
  category,
  name,
  markdown,
  colour
}) => {
  return (
    <div className={styles.markdownCard}>
      <div className={imageStyles.title}>
        <span className={imageStyles.category}>{category}</span>
        <span
          className={imageStyles.name}
          style={{ color: colourString(colour) }}
        >
          {name}
        </span>
      </div>
      <div className="markdown-body">
        <ReactMarkdown source={markdown.raw} escapeHtml={false} />
      </div>
    </div>
  );
};

type MarkdownCategoryProps = {
  category: string;
  data: MarkdownMap;
  colourMap: ColourMap;
};

const MarkdownCategory: React.FC<MarkdownCategoryProps> = ({
  category,
  data,
  colourMap
}) => {
  const logCards = [];
  for (const [name, d] of data) {
    const markdown = d.markdown[category];
    const colour = colourMap.get(name);
    if (markdown === undefined || colour === undefined) {
      continue;
    }
    logCards.push(
      <MarkdownCard
        category={category}
        name={name}
        markdown={markdown}
        colour={colour}
        key={`${category}-${name}`}
      />
    );
  }
  return <>{logCards}</>;
};

type Props = {
  data: MarkdownMap;
  colours: ColourMap;
};

export const Markdown: React.FC<Props> = ({ data, colours }) => {
  const categories = sortedCategories(data);
  return (
    <>
      {categories.map(category => (
        <MarkdownCategory
          category={category}
          data={data}
          colourMap={colours}
          key={category}
        />
      ))}
    </>
  );
};
