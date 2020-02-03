import { navigate, useInterceptor, useRoutes } from "hookrouter";
import React, { useEffect, useState } from "react";
import { fetchData } from "./api";
import * as styles from "./App.styles";
import { Colour, ColourMap } from "./colour/definition";
import { Commands } from "./Commands";
import { DataMap } from "./data";
import { Header } from "./Header";
import { Images } from "./Images";
import { Logs } from "./Logs";
import { Markdown } from "./Markdown";
import { Overlay, OverlayContext, OverlayFn } from "./Overlay";
import { Scalars } from "./Scalars";
import { Names, Sidebar } from "./Sidebar";
import {
  retrieveColours,
  retrieveNames,
  storeColours,
  storeNames
} from "./storage";
import { Texts } from "./Texts";

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
  const [overlay, setOverlay] = useState<{ fn?: OverlayFn }>({});
  const overlayContext = {
    show: (fn: OverlayFn) => setOverlay({ fn }),
    hide: () => setOverlay({})
  };
  const setNewData = (d: DataMap) => {
    setData(d);
    const newNames = retrieveNames([...d.keys()].sort());
    setNames(newNames);
    setColours(retrieveColours(newNames));
  };

  useEffect(() => {
    if (hasFetched) {
      storeNames(names);
      storeColours(colours);
    }
  }, [hasFetched, names, colours]);
  useEffect(() => {
    fetchData().then(d => {
      setNewData(d);
      setHasFetched(true);
    });
  }, []);
  useEffect(() => {
    if (hasFetched) {
      const eventSource = new EventSource("/events");
      let lastEvent = 0;
      eventSource.addEventListener("data", e => {
        const { data, lastEventId } = e as MessageEvent;
        const eventId = Number.parseInt(lastEventId);
        if (eventId > lastEvent) {
          const d = new Map(Object.entries(JSON.parse(data)));
          setNewData(d);
          lastEvent = eventId;
        }
      });
      // Close the connetion, when unmounted
      return () => {
        eventSource.close();
      };
    }
  }, [hasFetched]);
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
      <Overlay>{overlay.fn}</Overlay>
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
            <div className={styles.content}>
              <Content
                data={data}
                colours={colours}
                names={names.active}
                hideName={hideName}
              />
            </div>
          )}
        </main>
      </div>
    </OverlayContext.Provider>
  );
};
