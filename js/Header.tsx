import React from "react";
import * as styles from "./Header.styles";
import { A, usePath } from "hookrouter";

type LinkProps = {
  href: string;
  className: string;
  activeClassName: string;
  [others: string]: any;
};

const Link: React.FC<LinkProps> = ({
  href,
  className,
  activeClassName,
  ...restProps
}) => {
  const currentPath = usePath();
  const isCurrent = currentPath === href;
  const actualClassName = isCurrent ? activeClassName : className;
  return <A {...restProps} href={href} className={actualClassName} />;
};

export const Header = () => (
  <header className={styles.header}>
    <nav className={styles.nav}>
      <Link
        href="/scalars"
        className={styles.item}
        activeClassName={styles.active}
      >
        Scalars
      </Link>
      <Link
        href="/images"
        className={styles.item}
        activeClassName={styles.active}
      >
        Images
      </Link>
      <Link
        href="/text"
        className={styles.item}
        activeClassName={styles.active}
      >
        Text
      </Link>
      <Link
        href="/logs"
        className={styles.item}
        activeClassName={styles.active}
      >
        Logs
      </Link>
      <Link
        href="/markdown"
        className={styles.item}
        activeClassName={styles.active}
      >
        Markdown
      </Link>
      <Link
        href="/about"
        className={styles.item}
        activeClassName={styles.active}
      >
        About
      </Link>
    </nav>
  </header>
);
