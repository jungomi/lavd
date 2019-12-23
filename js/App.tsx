import { css } from "emotion";
import React from "react";
import { Content } from "./Content";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

import { assignColours } from "./plot/colour";
import { data } from "./fixture";

const mainClass = css({
  display: "flex",
  height: "100%",
  position: "relative"
});

export const App = () => {
  const names = [...data.keys()];
  const colourMap = assignColours(names);
  return (
    <>
      <Header />
      <div className={mainClass}>
        <Sidebar names={names} colours={colourMap} />
        <Content data={data} colours={colourMap} />
      </div>
    </>
  );
};
