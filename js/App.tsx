import { css } from "emotion";
import React from "react";
import { Content } from "./Content";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

const mainClass = css({
  display: "flex",
  height: "100%",
  position: "relative",
});

export const App = () => (
  <>
    <Header />
    <div className={mainClass}>
      <Sidebar />
      <Content />
    </div>
  </>
);
