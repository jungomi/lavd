import { navigate, useRoutes, useInterceptor } from "hookrouter";
import React, { useState, useEffect } from "react";
import * as styles from "./App.styles";
import { Colour, ColourMap } from "./colour/definition";
import { Header } from "./Header";
import { Images } from "./Images";
import { Logs } from "./Logs";
import { Scalars } from "./Scalars";
import { Names, Sidebar } from "./Sidebar";
import { Texts } from "./Texts";
import { Markdown } from "./Markdown";
import { Commands } from "./Commands";
import { Overlay, OverlayContext } from "./Overlay";
import {
  retrieveNames,
  retrieveColours,
  storeNames,
  storeColours
} from "./storage";
import { fetchData } from "./api";

import { DataMap } from "./data";

type RouteProps = {
  data: DataMap;
  colours: ColourMap;
  names: Array<string>;
  hideName: (name: string) => void;
};

type Routes = {
  [route: string]: () => (props: RouteProps) => JSX.Element;
};

const routes: Routes = {
  "/scalars": () => ({ data, colours, names }) => (
    <Scalars data={data} colours={colours} names={names} />
  ),
  "/images": () => ({ data, colours, names, hideName }) => (
    <Images data={data} colours={colours} names={names} hideName={hideName} />
  ),
  "/text": () => ({ data, colours, names, hideName }) => (
    <Texts data={data} colours={colours} names={names} hideName={hideName} />
  ),
  "/logs": () => ({ data, colours, names, hideName }) => (
    <Logs data={data} colours={colours} names={names} hideName={hideName} />
  ),
  "/markdown": () => ({ data, colours, names, hideName }) => (
    <Markdown data={data} colours={colours} names={names} hideName={hideName} />
  ),
  "/commands": () => ({ data, colours, names, hideName }) => (
    <Commands data={data} colours={colours} names={names} hideName={hideName} />
  ),
  "/about": () => () => <span>About</span>
};

type Element = JSX.Element | Array<JSX.Element> | undefined;

export const App = () => {
  const [data, setData] = useState<DataMap>(new Map());
  const [hasFetched, setHasFetched] = useState(false);
  const Content: React.FC<RouteProps> = useRoutes(routes);
  if (Content === null) {
    navigate("/scalars");
  }
  const [names, setNames] = useState<Names>(
    retrieveNames([...data.keys()].sort())
  );
  const [colours, setColours] = useState(retrieveColours(names));
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
  useEffect(() => {
    if (hasFetched) {
      storeNames(names);
      storeColours(colours);
    }
  }, [hasFetched, names, colours]);
  useEffect(() => {
    fetchData().then(d => {
      setData(d);
      const newNames = retrieveNames([...d.keys()].sort());
      setNames(newNames);
      setColours(retrieveColours(newNames));
      setHasFetched(true);
    });
  }, []);
  // The interceptor gets called everytime the route changes. When it happens,
  // the overlay is automatically closed.
  useInterceptor((_, nextPath) => {
    overlayContext.hide();
    return nextPath;
  });
  const hideName = (name: string) => {
    setNames({
      active: names.active.filter(n => n !== name),
      inactive: [...names.inactive, name].sort()
    });
  };
  return (
    <OverlayContext.Provider value={overlayContext}>
      <Overlay>{overlay}</Overlay>
      <Header />
      <div className={styles.wrapper}>
        <Sidebar
          names={names}
          setNames={setNames}
          colours={colours}
          setColour={setNewColour}
        />
        <main className={styles.main}>
          {Content && (
            <Content
              data={data}
              colours={colours}
              names={names.active}
              hideName={hideName}
            />
          )}
        </main>
      </div>
    </OverlayContext.Provider>
  );
};
