import { css } from "emotion";
import React, { useState } from "react";
import { Content } from "./Content";
import { Header } from "./Header";
import { assignColours } from "./plot/colour";
import { Sidebar } from "./Sidebar";
import { Colour } from "./plot/colour";

import { data } from "./fixture";

const mainClass = css({
  display: "flex",
  height: "100%",
  position: "relative"
});

export const App = () => {
  const names = [...data.keys()];
  const colourMap = assignColours(names);
  const [colours, setColours] = useState(new Map(colourMap));
  // A copy map of the Map is created such that React re-renders it, since
  // mutating it change the reference and therefore not trigger a re-render.
  const setNewColour = (name: string, colour: Colour) => {
    setColours(new Map(colours.set(name, colour)));
  };
  return (
    <>
      <Header />
      <div className={mainClass}>
        <Sidebar names={names} colours={colours} setColour={setNewColour} />
        <Content data={data} colours={colours} />
      </div>
    </>
  );
};
