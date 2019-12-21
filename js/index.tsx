import { injectGlobal } from "emotion";
import resetCss from "emotion-reset";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import * as globalCss from "./global.styles";

injectGlobal`${resetCss}
${globalCss.fixHeight}
${globalCss.scrollbar}
${globalCss.apexcharts}
`;

ReactDOM.render(<App />, document.getElementById("root"));
