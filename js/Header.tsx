import { cx } from "emotion";
import React from "react";
import * as styles from "./Header.styles";

export const Header = () => (
  <header className={styles.header}>
    <nav className={styles.nav}>
      <span className={styles.item}>First</span>
      <span className={cx(styles.item, styles.active)}>Second</span>
      <span className={styles.item}>Third</span>
    </nav>
  </header>
);
