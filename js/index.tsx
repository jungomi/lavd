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

.apexcharts-tooltip {
  line-height: 0.5;
  padding: 0.3rem;
  color: #ffffff;
  font-weight: bold;
  background: rgba(0, 0, 0, 0.65) !important;
  border: 2px solid #666666 !important;
  transition: none !important;
}
.apexcharts-tooltip-marker {
  width: 0.6rem !important;
  height: 0.6rem !important;
  margin-right: 0.4rem !important;
  border-radius: 100% !important;
}
.apexcharts-tooltip-series-group.active {
  padding-bottom: 0 !important;
}
.apexcharts-tooltip-text {
  width: 100%;
}
.apexcharts-tooltip-y-group {
  display: flex;
  justify-content: space-between;
}
.apexcharts-tooltip-text-value {
  margin-left: 0.5rem !important;
}
`

ReactDOM.render(<App />, document.getElementById("root"));
