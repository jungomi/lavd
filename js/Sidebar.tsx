import React, { useState } from "react";
import { ColourPicker } from "./colour/ColourPicker";
import {
  Colour,
  ColourMap,
  colourString,
  defaultColour
} from "./colour/definition";
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

  return (
    <div className={styles.sidebar}>
      {names.map(name => {
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
      })}
    </div>
  );
};
