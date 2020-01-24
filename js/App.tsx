import { navigate, useRoutes, useInterceptor } from "hookrouter";
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
import { Overlay, OverlayContext } from "./Overlay";

import { data } from "./fixture";
import { DataMap } from "./data";

type RouteProps = {
  data: DataMap;
  colours: ColourMap;
  names: Array<string>;
};

type Routes = {
  [route: string]: () => (props: RouteProps) => JSX.Element;
};

const routes: Routes = {
  "/scalars": () => ({ data, colours }) => (
    <Scalars data={data} colours={colours} />
  ),
  "/images": () => ({ data, colours, names }) => (
    <Images data={data} colours={colours} names={names} />
  ),
  "/text": () => ({ data, colours, names }) => (
    <Texts data={data} colours={colours} names={names} />
  ),
  "/logs": () => ({ data, colours, names }) => (
    <Logs data={data} colours={colours} names={names} />
  ),
  "/markdown": () => ({ data, colours, names }) => (
    <Markdown data={data} colours={colours} names={names} />
  ),
  "/commands": () => ({ data, colours, names }) => (
    <Commands data={data} colours={colours} names={names} />
  ),
  "/about": () => () => <span>About</span>
};

type Element = JSX.Element | Array<JSX.Element> | undefined;

export const App = () => {
  const Content = useRoutes(routes);
  if (Content === null) {
    navigate("/scalars");
  }
  const names = [...data.keys()].sort();
  const colourMap = assignColours(names);
  const [colours, setColours] = useState(new Map(colourMap));
  // A copy map of the Map is created such that React re-renders it, since
  // mutating it change the reference and therefore not trigger a re-render.
  const setNewColour = (name: string, colour: Colour) => {
    setColours(new Map(colours.set(name, colour)));
  };
  const [overlay, setOverlay] = useState<Element>(undefined);
  const overlayContext = {
    show: (elem: Element) => setOverlay(elem),
    hide: () => setOverlay(undefined)
  };
  // The interceptor gets called everytime the route changes. When it happens,
  // the overlay is automatically closed.
  useInterceptor((_, nextPath) => {
    overlayContext.hide();
    return nextPath;
  });
  return (
    <OverlayContext.Provider value={overlayContext}>
      <Overlay>{overlay}</Overlay>
      <Header />
      <div className={styles.wrapper}>
        <Sidebar names={names} colours={colours} setColour={setNewColour} />
        <main className={styles.main}>
          {Content && <Content data={data} colours={colours} names={names} />}
        </main>
      </div>
    </OverlayContext.Provider>
  );
};
