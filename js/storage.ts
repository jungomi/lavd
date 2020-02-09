import {
  assignColours,
  ColourMap,
  getDistinctColour
} from "./colour/definition";
import { Names } from "./Sidebar";

export function storeNames(names: Names) {
  localStorage.setItem("names", JSON.stringify(names));
}

export function retrieveNames(nameList: Array<string>): Names {
  const names: Names | null = JSON.parse(
    // JSON.parse accepts null as input, but TypeScript doesn't.
    localStorage.getItem("names") || "null"
  );
  if (names) {
    // Names that were not in the local storage, are added to the active list.
    const newNames = nameList.filter(
      n => !names.active.includes(n) && !names.inactive.includes(n)
    );
    // Only keep the names from the storage that are still present in the list.
    const activeNames = names.active.filter(n => nameList.includes(n));
    const inactiveNames = names.inactive.filter(n => nameList.includes(n));
    return {
      active: [...activeNames, ...newNames].sort(),
      inactive: inactiveNames
    };
  } else {
    return { active: nameList, inactive: [] };
  }
}

export function storeColours(colours: ColourMap) {
  localStorage.setItem("colours", JSON.stringify([...colours]));
}

export function retrieveColours(names: Names): ColourMap {
  const allNames = [...names.active, ...names.inactive].sort();
  const storedColours = JSON.parse(
    // JSON.parse accepts null as input, but TypeScript doesn't.
    localStorage.getItem("colours") || "null"
  );
  if (storedColours) {
    const colours: ColourMap = new Map(storedColours);
    for (const [name, colour] of storedColours) {
      // Only overwrite the colours that are still present and were set.
      if (colours.has(name)) {
        colours.set(name, colour);
      }
    }
    // The new colours start from after the already existing ones.
    let i = colours.size;
    for (const name of allNames) {
      // New names don't have a colour yet, so assign them a new one.
      if (!colours.has(name)) {
        colours.set(name, getDistinctColour(i));
        i += 1;
      }
    }
    return colours;
  } else {
    return assignColours(allNames);
  }
}
