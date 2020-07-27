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
    fg: "rgba(0, 0, 0, 0.2)",
    bg: "transparent",
    hover: "rgba(0, 0, 0, 0.3)",
    active: "rgba(0, 0, 0, 0.5)",
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
}
.markdown-body > pre {
  background: #f7f7f7;
}
`;
