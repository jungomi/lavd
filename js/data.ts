import { Image } from "./Images";
import { Scalars } from "./Scalars";
import { Text } from "./Texts";
import { Log } from "./Logs";
import { MarkdownDocument } from "./Markdown";
import { Command } from "./Commands";
import { ColourMap, Colour } from "./colour/definition";

export type Optional<T> = T | undefined;

export type Data = {
  scalars?: {
    [name: string]: Optional<Scalars>;
  };
  images?: {
    [name: string]: Optional<Image>;
  };
  texts?: {
    [name: string]: Optional<Text>;
  };
  logs?: {
    [name: string]: Optional<Log>;
  };
  markdown?: {
    [name: string]: Optional<MarkdownDocument>;
  };
  command?: Optional<Command>;
};

export interface CategoryData {
  scalars: Scalars;
  images: Image;
  texts: Text;
  logs: Log;
  markdown: MarkdownDocument;
}

// Bascially:
//   | "scalars"
//   | "images"
//   | "texts"
//   | "logs"
//   | "markdown";
//
// But when using the keys it will stay in sync with the CategoryData.
export type DataKind = keyof CategoryData;

export type DataMap = Map<string, Data>;

export function sortedCategories(
  data: DataMap | undefined,
  kind: DataKind
): Array<string> {
  if (data === undefined) {
    return [];
  }
  const uniqueCategories: Set<string> = new Set();
  for (const d of data.values()) {
    const datOfKind = d[kind];
    if (datOfKind === undefined) {
      continue;
    }
    for (const key of Object.keys(datOfKind)) {
      uniqueCategories.add(key);
    }
  }
  return Array.from(uniqueCategories).sort();
}

// It's sort of generic, but with a limitied number of types, the data kinds.
// Therefore CategoryDataEntry<"scalars"> would be allowed, but
// CategoryDataEntry<"something"> would not.
export type CategoryDataEntry<K extends DataKind> = {
  // Use the type that belongs to the data kind K.
  data: CategoryData[K];
  name: string;
  colour: Colour;
  key: string;
};

export function nonEmptyCategoryData<K extends DataKind>(
  data: DataMap,
  kind: K,
  category: string,
  colourMap: ColourMap
): Array<CategoryDataEntry<K>> {
  const categoryData = [];
  for (const [name, dat] of data) {
    const datOfKind = dat[kind];
    if (datOfKind === undefined) {
      continue;
    }
    const d = datOfKind[category];
    const colour = colourMap.get(name);
    if (d === undefined || colour === undefined) {
      continue;
    }
    categoryData.push({
      // The "as CategoryData[K]" is to use the type that the kind belongs to,
      // even though TypeScript should know this at this point.
      data: d as CategoryData[K],
      name: name,
      colour: colour,
      key: `${kind}-${category}-${name}`
    });
  }
  return categoryData;
}
