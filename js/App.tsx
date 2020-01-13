import { navigate, useRoutes } from "hookrouter";
import React, { useState } from "react";
import * as styles from "./App.styles";
import { assignColours, Colour, ColourMap } from "./colour/definition";
import { Header } from "./Header";
import { Images } from "./Images";
import { Logs } from "./Logs";
import { Scalars } from "./Scalars";
import { Sidebar } from "./Sidebar";
import { Texts } from "./Texts";
import { Markdown } from "./Markdown";
import { Commands } from "./Commands";

import { data } from "./fixture";
import { DataMap } from "./data";

type RouteProps = {
  data: DataMap;
  colours: ColourMap;
};

type Routes = {
  [route: string]: () => (props: RouteProps) => JSX.Element;
};

const routes: Routes = {
  "/scalars": () => ({ data, colours }) => (
    <Scalars data={data} colours={colours} />
  ),
  "/images": () => ({ data, colours }) => (
    <Images data={data} colours={colours} />
  ),
  "/text": () => ({ data, colours }) => <Texts data={data} colours={colours} />,
  "/logs": () => ({ data, colours }) => <Logs data={data} colours={colours} />,
  "/markdown": () => ({ data, colours }) => (
    <Markdown data={data} colours={colours} />
  ),
  "/commands": () => ({ data, colours }) => (
    <Commands data={data} colours={colours} />
  ),
  "/about": () => () => <span>About</span>
};

export const App = () => {
  const Content = useRoutes(routes);
  if (Content === null) {
    navigate("/scalars");
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
