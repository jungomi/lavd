import React from "react";
import * as styles from "./Sidebar.styles";

type Props = {
  names: Array<string>;
  colours: Map<string, string>;
};

export const Sidebar: React.FC<Props> = ({ names, colours }) => (
  <div className={styles.sidebar}>
    {names.map(name => (
      <div key={name} className={styles.entry}>
        <span
          className={styles.colour}
          style={{ backgroundColor: colours.get(name) }}
        />
        <span>{name}</span>
      </div>
    ))}
  </div>
);
