import React, { useEffect, useState } from "react";
import { ColourPicker } from "./colour/ColourPicker";
import {
  Colour,
  ColourMap,
  colourString,
  defaultColour
} from "./colour/definition";
import { SmallEmpty } from "./Empty";
import * as styles from "./Sidebar.styles";

type Props = {
  names: Array<string>;
  colours: ColourMap;
  setColour: (name: string, colour: Colour) => void;
};

export const Sidebar: React.FC<Props> = ({ names, colours, setColour }) => {
  const [shownColourPicker, setShownColourPicker] = useState<
    string | undefined
  >(undefined);
  const mediaQuery = window.matchMedia("(min-width: 896px)");
  const [shown, setShown] = useState(mediaQuery.matches);
  const toggle = () => setShown(!shown);
  useEffect(() => {
    const updateShown = () => setShown(mediaQuery.matches);
    // Update when the media media query is toggled.
    mediaQuery.addListener(updateShown);
    return () => {
      mediaQuery.removeListener(updateShown);
    };
  });

  const nameList = names.map(name => {
    const colour: Colour = colours.get(name) || defaultColour;
    return (
      <div key={name} className={styles.entry}>
        <span
          className={styles.colour}
          style={{ background: colourString(colour) }}
          onClick={() => setShownColourPicker(name)}
        />
        <span>{name}</span>
        {shownColourPicker === name && (
          <ColourPicker
            colour={colour}
            onSelect={colour => {
              setShownColourPicker(undefined);
              setColour(name, colour);
            }}
          />
        )}
      </div>
    );
  });

  return (
    <div className={shown ? styles.sidebar : styles.sidebarHidden}>
      <svg
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        className={shown ? styles.toggle : styles.toggleHidden}
        onClick={toggle}
      >
        <path d="M11.727 26.71l9.977-9.999a1.012 1.012 0 000-1.429l-9.97-9.991c-.634-.66-1.748-.162-1.723.734v19.943c-.023.893 1.083 1.377 1.716.742zm7.84-10.713l-7.55 7.566V8.431l7.55 7.566z" />
      </svg>
      <div className={shown ? styles.nameList : styles.nameListHidden}>
        {nameList.length === 0 ? <SmallEmpty text="data" /> : nameList}
      </div>
    </div>
  );
};
