import { navigate, useInterceptor, useRoutes } from "hookrouter";
import React, { useEffect, useState } from "react";
import { fetchData } from "./api";
import * as styles from "./App.styles";
import { Colour, ColourMap } from "./colour/definition";
import { Commands } from "./Commands";
import { DataMap, Optional } from "./data";
import { Filter } from "./Filter";
import { Header } from "./Header";
import { Images } from "./Images";
import { Logs } from "./Logs";
import { Markdown } from "./Markdown";
import { Overlay, OverlayContext, OverlayFn } from "./Overlay";
import { Scalars } from "./Scalars";
import { Names, Sidebar } from "./Sidebar";
import { Loading } from "./Spinner";
import {
  retrieveColours,
  retrieveNames,
  storeColours,
  storeNames,
} from "./storage";
import { Texts } from "./Texts";

type RouteProps = {
  data: DataMap;
  colours: ColourMap;
  names: Array<string>;
  hideName: (name: string) => void;
  categoryFilter?: RegExp;
};

type Routes = {
  [route: string]: () => (props: RouteProps) => JSX.Element;
};

const routes: Routes = {
  "/scalars": () => ({ data, colours, names, categoryFilter }) => (
    <Scalars
      data={data}
      colours={colours}
      names={names}
      categoryFilter={categoryFilter}
    />
  ),
  "/images": () => ({ data, colours, names, hideName, categoryFilter }) => (
    <Images
      data={data}
      colours={colours}
      names={names}
      hideName={hideName}
      categoryFilter={categoryFilter}
    />
  ),
  "/text": () => ({ data, colours, names, hideName, categoryFilter }) => (
    <Texts
      data={data}
      colours={colours}
      names={names}
      hideName={hideName}
      categoryFilter={categoryFilter}
    />
  ),
  "/logs": () => ({ data, colours, names, hideName, categoryFilter }) => (
    <Logs
      data={data}
      colours={colours}
      names={names}
      hideName={hideName}
      categoryFilter={categoryFilter}
    />
  ),
  "/markdown": () => ({ data, colours, names, hideName, categoryFilter }) => (
    <Markdown
      data={data}
      colours={colours}
      names={names}
      hideName={hideName}
      categoryFilter={categoryFilter}
    />
  ),
  "/commands": () => ({ data, colours, names, hideName }) => (
    <Commands data={data} colours={colours} names={names} hideName={hideName} />
  ),
};

export const App = () => {
  const [data, setData] = useState<DataMap>(new Map());
  const [hasFetched, setHasFetched] = useState(false);
  const Content: React.FC<RouteProps> = useRoutes(routes);
  if (Content === null) {
    navigate("/scalars");
  }
  const [nameFilter, setNameFilter] = useState<Optional<RegExp>>(undefined);
  const [names, setNames] = useState<Names>(
    retrieveNames([...data.keys()].sort())
  );
  const [categoryFilter, setCategoryFilter] = useState<Optional<RegExp>>(
    undefined
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
    hide: () => setOverlay({}),
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
    fetchData().then((d) => {
      setNewData(d);
      setHasFetched(true);
    });
  }, []);
  useEffect(() => {
    if (hasFetched) {
      const eventSource = new EventSource("/events");
      let lastEvent = 0;
      eventSource.addEventListener("data", (e) => {
        const { data, lastEventId } = e as MessageEvent;
        const eventId = Number.parseInt(lastEventId);
        if (eventId > lastEvent) {
          const d: DataMap = new Map(Object.entries(JSON.parse(data)));
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
  const filteredNames = {
    active: names.active,
    inactive: names.inactive,
    activeVisible:
      nameFilter === undefined
        ? names.active
        : names.active.filter((n) => nameFilter.test(n)),
    inactiveVisible:
      nameFilter === undefined
        ? names.inactive
        : names.inactive.filter((n) => nameFilter.test(n)),
  };
  const hideName = (name: string) => {
    setNames({
      active: names.active.filter((n) => n !== name),
      inactive: [...names.inactive, name].sort(),
    });
  };

  return (
    <OverlayContext.Provider value={overlayContext}>
      <Overlay>{overlay.fn}</Overlay>
      <Header />
      <div className={styles.wrapper}>
        <Sidebar
          names={filteredNames}
          setNames={setNames}
          setNameFilter={setNameFilter}
          colours={colours}
          setColour={setNewColour}
          loading={!hasFetched}
        />
        <main className={styles.main}>
          <Filter
            updateFilter={setCategoryFilter}
            placeholder="Filter Categories (Regex)"
          />
          {hasFetched ? (
            Content && (
              <div className={styles.content}>
                <Content
                  data={data}
                  colours={colours}
                  names={filteredNames.activeVisible}
                  hideName={hideName}
                  categoryFilter={categoryFilter}
                />
              </div>
            )
          ) : (
            <Loading />
          )}
        </main>
      </div>
    </OverlayContext.Provider>
  );
};
