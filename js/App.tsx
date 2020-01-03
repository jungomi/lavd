import { navigate, useRoutes } from "hookrouter";
import React, { useState } from "react";
import * as styles from "./App.styles";
import { assignColours, Colour, ColourMap } from "./colour/definition";
import { Header } from "./Header";
import { ImageMap, Images } from "./Images";
import { Scalars, StatMap } from "./Scalars";
import { Sidebar } from "./Sidebar";
import { Texts, TextMap } from "./Texts";

import { images } from "./fixture/image";
import { data } from "./fixture/scalar";
import { texts } from "./fixture/text";

type RouteProps = {
  scalars: StatMap;
  images: ImageMap;
  texts: TextMap;
  colours: ColourMap;
};

type Routes = {
  [route: string]: () => (props: RouteProps) => JSX.Element;
};

const routes: Routes = {
  "/scalar": () => ({ scalars, colours }) => (
    <Scalars data={scalars} colours={colours} />
  ),
  "/image": () => ({ images, colours }) => (
    <Images data={images} colours={colours} />
  ),
  "/text": () => ({ texts, colours }) => (
    <Texts data={texts} colours={colours} />
  ),
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
          {Content && (
            <Content
              scalars={data}
              images={images}
              texts={texts}
              colours={colours}
            />
          )}
        </main>
      </div>
    </>
  );
};
