// This import registers the CSS for markdown and copies it to the build
// directory.
import "github-markdown-css";

import { injectGlobal } from "emotion";
import resetCss from "emotion-reset";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import * as globalCss from "./global.styles";

injectGlobal`${resetCss}
${globalCss.fixHeight}
${globalCss.scrollbar}
${globalCss.markdown}
`;

ReactDOM.render(<App />, document.getElementById("root"));
