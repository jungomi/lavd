type PropertyDefinitions = {
  [key: string]: string | PropertyDefinitions;
};

// Wraps all custom properties into var(...)
function wrapVars(props: PropertyDefinitions): PropertyDefinitions {
  return Object.fromEntries(
    Object.entries(props).map(([key, value]) => [
      key,
      typeof value === "string" ? `var(${value})` : wrapVars(value),
    ])
  );
}

export const properties = {
  bg: "--colour-background",
  fg: "--colour-text",
  fg2: "--colour-text-secondary",
  fg3: "--colour-text-tertiary",
  link: "--colour-link",
  error: "--colour-error",
  border: "--colour-border",
  border2: "--colour-border-secondary",
  header: {
    bg: "--colour-header-background",
    fg: "--colour-header-text",
    active: "--colour-header-text-active",
    icon: "--colour-header-icon",
  },
  scrollbar: {
    fg: "--colour-scrollbar-fg",
    hover: "--colour-scrollbar-hover",
    active: "--colour-scrollbar-active",
  },
  diff: {
    added: "--colour-diff-added",
    removed: "--colour-diff-removed",
  },
  card: {
    bg: "--colour-card-background",
    border: "--colour-card-border",
    hover: "--colour-card-hover",
    arrow: {
      enabled: "--colour-card-arrow-enabled",
      disabled: "--colour-card-arrow-disabled",
      hover: "--colour-card-arrow-hover",
    },
    icon: {
      fg: "--colour-card-icon-fg",
      hover: "--colour-card-icon-hover",
    },
  },
  log: {
    timestamp: "--colour-log-timestamp",
    hover: "--colour-log-hover",
    linenr: {
      text: "--colour-log-linenr-text",
      hover: "--colour-log-linenr-hover",
    },
  },
  input: {
    border: "--colour-input-border",
    placeholder: "--colour-input-placeholder",
    hover: {
      border: "--colour-input-hover-border",
    },
    dropdown: {
      bg: "--colour-input-dropdown-background",
    },
  },
  copy: {
    bg: "--colour-copy-background",
    hover: "--colour-copy-hover",
    tooltip: "--colour-copy-tooltip-background",
    shadow: {
      primary: "--colour-copy-shadow-primary",
      secondary: "--colour-copy-shadow-secondary",
    },
  },
  code: "--colour-code-block",
  table: {
    border: "--colour-table-border",
  },
  plot: {
    axis: "--colour-plot-axis",
    grid: "--colour-plot-grid",
    label: "--colour-plot-label",
    tooltip: {
      bg: "--colour-plot-tooltip-background",
      fg: "--colour-plot-tooltip-text",
      border: "--colour-plot-tooltip-border",
    },
  },
  picker: {
    bg: "--colour-picker-background",
    switch: {
      hover: "--colour-picker-switch-hover",
      active: "--colour-picker-switch-active",
    },
  },
};

// For convenience to avoid having to write var(...) every time.
export const cssVars = wrapVars(properties) as typeof properties;

// These are given as strings because they will be used as a global CSS,
// which need to be actual CSS.
// No selector is given because they will be used in multiple selectors.
export const dark = `
  color-scheme: dark;
  ${properties.bg}: #202225;
  ${properties.fg}: #c9d1d9;
  ${properties.fg2}: #a9a9a9;
  ${properties.fg3}: #bfbfbf;
  ${properties.link}: #7ab4fc;
  ${properties.error}: rgba(255, 80, 80, 0.20);
  ${properties.border}: #2d2d2d;
  ${properties.border2}: #595959;
  ${properties.header.bg}: #202225;
  ${properties.header.fg}: #aaaaaa;
  ${properties.header.active}: #ffffff;
  ${properties.header.icon}: #ffffff;
  ${properties.scrollbar.fg}: rgba(255, 255, 255, 0.2);
  ${properties.scrollbar.hover}: rgba(255, 255, 255, 0.3);
  ${properties.scrollbar.active}: rgba(255, 255, 255, 0.5);
  ${properties.diff.added}: #46954a;
  ${properties.diff.removed}: #b94c47;
  ${properties.card.bg}: rgb(255 255 255 / 1%);
  ${properties.card.border}: #353637;
  ${properties.card.hover}: rgba(255, 255, 255, 0.04);
  ${properties.card.arrow.enabled}: #a9a9a9;
  ${properties.card.arrow.disabled}: #6e6e6e;
  ${properties.card.arrow.hover}: #ff9800b0;
  ${properties.card.icon.fg}: #929292;
  ${properties.card.icon.hover}: #cecece;
  ${properties.log.timestamp}: #bdbdbd;
  ${properties.log.hover}: #35353587;
  ${properties.log.linenr.text}: rgba(255, 255, 255, 0.3);
  ${properties.log.linenr.hover}: rgba(255, 255, 255, 0.6);
  ${properties.input.border}: rgba(255, 255, 255, 0.2);
  ${properties.input.placeholder}: rgba(255, 255, 255, 0.4);
  ${properties.input.hover.border}: rgba(255, 255, 255, 0.4);
  ${properties.input.dropdown.bg}: #353535;
  ${properties.copy.bg}: #3a3a3a;
  ${properties.copy.hover}: rgba(125, 125, 125, 0.5);
  ${properties.copy.shadow.primary}: rgba(255, 255, 255, 0.12);
  ${properties.copy.shadow.secondary}: rgba(255, 255, 255, 0.24);
  ${properties.copy.tooltip}: #676d7f;
  ${properties.code}: #545a6c6b;
  ${properties.table.border}: #4d5259;
  ${properties.plot.axis}: #666666;
  ${properties.plot.grid}: #777777;
  ${properties.plot.label}: #cccccc;
  ${properties.plot.tooltip.fg}: #ffffff;
  ${properties.plot.tooltip.bg}: rgba(50, 52, 56, 0.9);
  ${properties.plot.tooltip.border}: rgba(100, 100, 100, 0.3);
  ${properties.picker.bg}: #2c2e31;
  ${properties.picker.switch.hover}: rgba(255, 255, 255, 0.06);
  ${properties.picker.switch.active}: rgba(255, 255, 255, 0.12);
`;

export const light = `
  color-scheme: light;
  ${properties.bg}: #f7f7f8;
  ${properties.fg}: #373a3c;
  ${properties.fg2}: #818a91;
  ${properties.fg3}: #616161;
  ${properties.link}: #0969da;
  ${properties.error}: rgba(255, 0, 0, 0.20);
  ${properties.border}: #eceeef;
  ${properties.border2}: #dadada;
  ${properties.header.bg}: #353535;
  ${properties.header.fg}: #aaaaaa;
  ${properties.header.active}: #ffffff;
  ${properties.header.icon}: #ffffff;
  ${properties.scrollbar.fg}: rgba(0, 0, 0, 0.2);
  ${properties.scrollbar.hover}: rgba(0, 0, 0, 0.3);
  ${properties.scrollbar.active}: rgba(0, 0, 0, 0.5);
  ${properties.diff.added}: #97f295;
  ${properties.diff.removed}: #ffb6ba;
  ${properties.card.bg}: inherit;
  ${properties.card.border}: #e2e4e7;
  ${properties.card.hover}: rgba(0, 0, 0, 0.02);
  ${properties.card.arrow.enabled}: #616161;
  ${properties.card.arrow.disabled}: #cccccc;
  ${properties.card.arrow.hover}: #ff9800b0;
  ${properties.card.icon.fg}: #cecece;
  ${properties.card.icon.hover}: #929292;
  ${properties.log.timestamp}: #5f5f5f;
  ${properties.log.hover}: #ebebeb87;
  ${properties.log.linenr.text}: rgba(27, 31, 35, 0.3);
  ${properties.log.linenr.hover}: rgba(27, 31, 35, 0.6);
  ${properties.input.border}: rgba(0, 0, 0, 0.12);
  ${properties.input.placeholder}: rgba(0, 0, 0, 0.4);
  ${properties.input.hover.border}: rgba(0, 0, 0, 0.36);
  ${properties.input.dropdown.bg}: #eaecef;
  ${properties.copy.bg}: inherit;
  ${properties.copy.hover}: rgba(237, 237, 237, 0.5);
  ${properties.copy.shadow.primary}: rgba(0, 0, 0, 0.12);
  ${properties.copy.shadow.secondary}: rgba(0, 0, 0, 0.24);
  ${properties.copy.tooltip}: #c1c7db;
  ${properties.code}: #e0e4f06b;
  ${properties.table.border}: #d0d7de;
  ${properties.plot.axis}: #bbbbbb;
  ${properties.plot.grid}: #cccccc;
  ${properties.plot.label}: #555555;
  ${properties.plot.tooltip.fg}: #ffffff;
  ${properties.plot.tooltip.bg}: rgba(75, 75, 75, 0.9);
  ${properties.plot.tooltip.border}: rgba(100, 100, 100, 0.3);
  ${properties.picker.bg}: #ffffff;
  ${properties.picker.switch.hover}: rgba(0, 0, 0, 0.06);
  ${properties.picker.switch.active}: rgba(0, 0, 0, 0.12);
`;
