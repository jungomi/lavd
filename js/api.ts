import { DataMap } from "./data";

export async function fetchData(): Promise<DataMap> {
  try {
    const response = await fetch("/api/all");
    const data = await response.json();
    const dataMap: DataMap = new Map(Object.entries(data));
    return dataMap;
  } catch (e) {
    return new Map();
  }
}

// The generic T is only here to distinguish what kind of data is requested.
// It's always determined by the component that calls it, but all of them just
// have a URL pointing to the end point.
export async function fetchUrl<T>(
  url: string,
  controller?: AbortController
): Promise<T | undefined> {
  try {
    const options: { signal?: AbortSignal } = {};
    if (controller) {
      options.signal = controller.signal;
    }
    const response = await fetch(url, options);
    return response.json();
  } catch (e) {
    return undefined;
  }
}
