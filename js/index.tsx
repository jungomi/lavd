import { injectGlobal } from "emotion";
import resetCss from "emotion-reset";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";

injectGlobal`${resetCss}
html, body {
  height: 100%;
}

#root {
  height: 100%;
  overflow: hidden;
}`

ReactDOM.render(<App />, document.getElementById("root"));
