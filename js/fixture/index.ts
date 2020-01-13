import { commands } from "./command";
import { images } from "./image";
import { logs } from "./log";
import { markdown } from "./markdown";
import { scalars } from "./scalar";
import { texts } from "./text";
import { DataMap } from "../data";

export { scalars, images, texts, logs, markdown, commands };

// Merge the data into the same DataMap, it's not a deep merge, hence values per
// kind get overwritten.
export function mergeData(data: Array<DataMap>): DataMap {
  const merged = new Map();
  for (const d of data) {
    for (const [key, value] of d) {
      merged.set(key, { ...merged.get(key), ...value });
    }
  }
  return merged;
}

export const data = mergeData([
  scalars,
  images,
  texts,
  logs,
  markdown,
  commands
]);
