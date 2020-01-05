import { navigate, useRoutes } from "hookrouter";
import React, { useState } from "react";
import * as styles from "./App.styles";
import { assignColours, Colour, ColourMap } from "./colour/definition";
import { Header } from "./Header";
import { ImageMap, Images } from "./Images";
import { Logs, LogMap } from "./Logs";
import { Scalars, StatMap } from "./Scalars";
import { Sidebar } from "./Sidebar";
import { Texts, TextMap } from "./Texts";
import { Markdown, MarkdownMap } from "./Markdown";

import { images } from "./fixture/image";
import { data } from "./fixture/scalar";
import { texts } from "./fixture/text";
import { logs } from "./fixture/log";
import { markdown } from "./fixture/markdown";

type RouteProps = {
  scalars: StatMap;
  images: ImageMap;
  texts: TextMap;
  logs: LogMap;
  markdown: MarkdownMap;
  colours: ColourMap;
};

type Routes = {
  [route: string]: () => (props: RouteProps) => JSX.Element;
};

const routes: Routes = {
  "/scalars": () => ({ scalars, colours }) => (
    <Scalars data={scalars} colours={colours} />
  ),
  "/images": () => ({ images, colours }) => (
    <Images data={images} colours={colours} />
  ),
  "/text": () => ({ texts, colours }) => (
    <Texts data={texts} colours={colours} />
  ),
  "/logs": () => ({ logs, colours }) => <Logs data={logs} colours={colours} />,
  "/markdown": () => ({ markdown, colours }) => (
    <Markdown data={markdown} colours={colours} />
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
          {Content && (
            <Content
              scalars={data}
              images={images}
              texts={texts}
              logs={logs}
              markdown={markdown}
              colours={colours}
            />
          )}
        </main>
      </div>
    </>
  );
};
