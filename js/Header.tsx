import { A, usePath } from "hookrouter";
import React, { useEffect, useState } from "react";
import * as styles from "./Header.styles";

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

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const mediaQuery = window.matchMedia("(max-width: 896px)");
  const [smallScreen, setSmallScreen] = useState(mediaQuery.matches);
  useEffect(() => {
    const updateScreenSize = () => {
      setSmallScreen(mediaQuery.matches);
      // The menu is closed once the media query triggers, whether it goes from
      // small to big or the other way around doesn't matter.
      setIsOpen(false);
    };
    // Update when the media media query is toggled.
    mediaQuery.addListener(updateScreenSize);
    return () => {
      mediaQuery.removeListener(updateScreenSize);
    };
  });
  const itemClass = isOpen ? styles.itemOpen : styles.item;
  const activeClass = isOpen ? styles.activeOpen : styles.active;
  const iconClass = isOpen ? styles.burgerIconOpen : styles.burgerIcon;
  const clickLink = (e: MouseEvent) => {
    if (isOpen) {
      setIsOpen(false);
    } else if (smallScreen) {
      // On small screens only the current tab is visible, therefore clicking on
      // it should open the menu instead of going to the same link you're
      // already on.
      e.preventDefault();
      setIsOpen(true);
    }
  };
  return (
    <header className={isOpen ? styles.headerOpen : styles.header}>
      <nav className={styles.nav}>
        <Link
          href="/scalars"
          onClick={clickLink}
          className={itemClass}
          activeClassName={activeClass}
        >
          Scalars
        </Link>
        <Link
          href="/images"
          onClick={clickLink}
          className={itemClass}
          activeClassName={activeClass}
        >
          Images
        </Link>
        <Link
          href="/text"
          onClick={clickLink}
          className={itemClass}
          activeClassName={activeClass}
        >
          Text
        </Link>
        <Link
          href="/logs"
          onClick={clickLink}
          className={itemClass}
          activeClassName={activeClass}
        >
          Logs
        </Link>
        <Link
          href="/markdown"
          onClick={clickLink}
          className={itemClass}
          activeClassName={activeClass}
        >
          Markdown
        </Link>
        <Link
          href="/commands"
          onClick={clickLink}
          className={itemClass}
          activeClassName={activeClass}
        >
          Commands
        </Link>
        <Link
          href="/about"
          onClick={clickLink}
          className={itemClass}
          activeClassName={activeClass}
        >
          About
        </Link>
      </nav>
      <div onClick={() => setIsOpen(!isOpen)} className={styles.burgerMenu}>
        <div className={iconClass} />
      </div>
    </header>
  );
};
