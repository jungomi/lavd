import React, { useState } from "react";
import { assignColours, Colour } from "./colour/definition";
import { Header } from "./Header";
import { Scalars } from "./Scalars";
import { Sidebar } from "./Sidebar";
import * as styles from "./App.styles";

import { data } from "./fixture";
import { useRoutes, navigate } from "hookrouter";

const routes = {
  "/scalar": () => Scalars,
  "/image": () => () => (
    <span className={styles.noData}>No images available</span>
  ),
  "/text": () => () => <span className={styles.noData}>No text available</span>,
  "/about": () => () => <span>About</span>
};

export const App = () => {
  const Content = useRoutes(routes);
  if (Content === null) {
    navigate("/scalar");
  }
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
      <div className={styles.wrapper}>
        <Sidebar names={names} colours={colours} setColour={setNewColour} />
        <main className={styles.main}>
          {Content && <Content data={data} colours={colours} />}
        </main>
      </div>
    </>
  );
};
