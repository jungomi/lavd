import { DataMap } from "./data";

export async function fetchData(): Promise<DataMap> {
  try {
    const response = await fetch("/api/all");
    const data = await response.json();
    const dataMap = new Map(Object.entries(data));
    return dataMap;
  } catch (e) {
    return new Map();
  }
}
