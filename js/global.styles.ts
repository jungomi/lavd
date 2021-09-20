import * as themeStyles from "./theme.styles";
import { cssVars } from "./theme.styles";

export const fixHeight = `
html, body {
  height: 100%;
}

#root {
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
`;

const scrollbarConfig = {
  colour: {
    fg: cssVars.scrollbar.fg,
    bg: "transparent",
    hover: cssVars.scrollbar.hover,
    active: cssVars.scrollbar.active,
  },
  size: "0.5rem",
  thumb: { minSize: "1.4rem" },
};

export const scrollbar = `
* {
  scrollbar-color: ${scrollbarConfig.colour.fg} ${scrollbarConfig.colour.bg};
  scrollbar-width: thin;
}
*::-webkit-scrollbar {
  height: ${scrollbarConfig.size};
  width: ${scrollbarConfig.size};
}
*::-webkit-scrollbar-track {
  background: ${scrollbarConfig.colour.bg};
}
*::-webkit-scrollbar-thumb {
  background: ${scrollbarConfig.colour.fg};
  border-radius: 4px;
  min-height: ${scrollbarConfig.thumb.minSize};
  min-width: ${scrollbarConfig.thumb.minSize};
}
*::-webkit-scrollbar-thumb:hover {
  background: ${scrollbarConfig.colour.hover};
}
*::-webkit-scrollbar-thumb:active {
  background: ${scrollbarConfig.colour.active};
}
*::-webkit-scrollbar-corner {
  background: ${scrollbarConfig.colour.bg};
}
`;

// The GitHub markdown CSS requires a div with the class markdown-body.
export const markdown = `
.markdown-body {
  overflow: scroll;
  padding-left: 1rem;
  padding-right: 1rem;
  color: ${cssVars.fg};
  background: inherit;
}
.markdown-body a {
  color: ${cssVars.link};
}
.markdown-body pre {
  background: ${cssVars.code};
}
.markdown-body ol {
  list-style: decimal;
}
.markdown-body table tr {
  background-color: inherit;
}
.markdown-body table tr:nth-child(2n) {
  background-color: ${cssVars.code};
}
.markdown-body table td, 
.markdown-body table th {
  border-color: ${cssVars.table.border};
}
`;

export const theme = `
:root {
  ${themeStyles.light}
}
@media(prefers-color-scheme: dark) {
  :root {
    ${themeStyles.dark}
  }
  img {
    filter: brightness(.8) contrast(1.1);
  }
}
[data-theme="light"] {
  ${themeStyles.light}
}
[data-theme="dark"] {
  ${themeStyles.dark}
}
[data-theme="light"] img {
  filter: unset;
}
[data-theme="dark"] img {
  filter: brightness(.8) contrast(1.1);
}
`;
