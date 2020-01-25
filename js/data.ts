import { Image } from "./Images";
import { Scalars } from "./Scalars";
import { Text } from "./Texts";
import { Log } from "./Logs";
import { MarkdownDocument } from "./Markdown";
import { Command } from "./Commands";
import { ColourMap, Colour } from "./colour/definition";

export type Optional<T> = T | undefined;

export type DataOfCategory<T> = {
  global?: Optional<T>;
  steps?: {
    [step: number]: Optional<T>;
  };
};

export type DataList<T> = {
  [name: string]: Optional<DataOfCategory<T>>;
};

export type Data = {
  scalars?: {
    [name: string]: Optional<Scalars>;
  };
  images?: DataList<Image>;
  texts?: DataList<Text>;
  logs?: DataList<Log>;
  markdown?: DataList<MarkdownDocument>;
  command?: Optional<Command>;
};

// Bascially:
//   | "scalars"
//   | "images"
//   | "texts"
//   | "logs"
//   | "markdown"
//   | "command";
//
// But when using the keys it will stay in sync with the Data
export type DataKind = keyof Data;

export type DataMap = Map<string, Data>;

// It's sort of generic, but with a limitied number of types, the data kinds.
// Therefore DataOfKind<"scalars"> would be allowed, but
// DataOfKind<"something"> would not.
export type DataOfKind<K extends DataKind> = {
  // Use the type that belongs to the data kind K.
  data: Data[K];
  name: string;
  colour: Colour;
};

export function getDataKind<K extends DataKind>(
  data: DataMap | undefined,
  kind: K,
  names: Array<string>,
  colours: ColourMap
): Array<DataOfKind<K>> {
  if (data === undefined) {
    return [];
  }
  const dataOfKind = [];
  for (const name of names) {
    const dat = data.get(name);
    const colour = colours.get(name);
    if (dat === undefined || colour === undefined) {
      continue;
    }
    const d = dat[kind];
    if (d === undefined) {
      continue;
    }
    dataOfKind.push({
      name,
      // The "as Data[K]" is to use the type that the kind belongs to, even
      // though TypeScript should know this at this point, since just before
      // that dat[kind] was done.
      data: d as Data[K],
      colour
    });
  }
  return dataOfKind;
}

export function sortedSteps<T>(dataList: DataList<T>): Array<number> {
  const uniqueSteps: Set<number> = new Set();
  for (const data of Object.values(dataList)) {
    if (data === undefined || data.steps === undefined) {
      continue;
    }
    for (const step of Object.keys(data.steps)) {
      uniqueSteps.add(Number.parseInt(step));
    }
  }
  return Array.from(uniqueSteps).sort();
}

export function sortedCategorySteps<T>(data: DataOfCategory<T>): Array<number> {
  const uniqueSteps: Set<number> = new Set();
  if (data === undefined || data.steps === undefined) {
    return [];
  }
  for (const step of Object.keys(data.steps)) {
    uniqueSteps.add(Number.parseInt(step));
  }
  return Array.from(uniqueSteps).sort();
}

export function sortObject<V>(
  obj: Optional<{ [key: string]: Optional<V> }>
): Array<{ key: string; value: V }> {
  if (obj === undefined) {
    return [];
  }
  const objs = [];
  const sortedKeys = Object.keys(obj).sort();
  for (const key of sortedKeys) {
    const value = obj[key];
    if (value !== undefined) {
      objs.push({ key, value });
    }
  }
  return objs;
}

export function aggregateSortedCategories(
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

export type ScalarEntry = {
  data: Scalars;
  name: string;
  colour: Colour;
};

export function nonEmptyScalars(
  data: DataMap,
  category: string,
  names: Array<string>,
  colours: ColourMap
): Array<ScalarEntry> {
  const categoryData = [];
  for (const name of names) {
    const dat = data.get(name);
    if (dat === undefined || dat.scalars === undefined) {
      continue;
    }
    const d = dat.scalars[category];
    const colour = colours.get(name);
    if (d === undefined || colour === undefined) {
      continue;
    }
    categoryData.push({ data: d, name: name, colour: colour });
  }
  return categoryData;
}
