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
    active: "rgba(0, 0, 0, 0.5)"
  },
  size: "0.5rem",
  thumb: { minSize: "1.4rem" }
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

// Apex charts are not that well integrated into React, therefore the styling
// is done with global CSS styles and often requires !important to overwrite
// their styles
export const apexcharts = `
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
  flex-shrink: 0;
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
.apexcharts-tooltip-title {
  background: none !important;
  border-bottom: none !important;
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
