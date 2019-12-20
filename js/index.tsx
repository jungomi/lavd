import { injectGlobal } from "emotion";
import resetCss from "emotion-reset";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";

const scrollbar = {
  colour: {
    fg: "rgba(0, 0, 0, 0.2)",
    bg : "transparent",
    hover : "rgba(0, 0, 0, 0.3)",
    active : "rgba(0, 0, 0, 0.5)",
  },
  size : "0.5rem",
};

injectGlobal`${resetCss}
html, body {
  height: 100%;
}

#root {
  height: 100%;
  overflow: hidden;
}


* {
  scrollbar-color: ${scrollbar.colour.fg} ${scrollbar.colour.bg};
  scrollbar-width: thin;
}
*::-webkit-scrollbar {
  height: ${scrollbar.size};
  width: ${scrollbar.size};
}
*::-webkit-scrollbar-track {
  background-color: ${scrollbar.colour.bg};
}
*::-webkit-scrollbar-thumb {
  background-color: ${scrollbar.colour.fg};
  border-radius: 4px;
}
*::-webkit-scrollbar-thumb:hover {
  background-color: ${scrollbar.colour.hover};
}
*::-webkit-scrollbar-thumb:active {
  background-color: ${scrollbar.colour.active};
}
`

ReactDOM.render(<App />, document.getElementById("root"));
