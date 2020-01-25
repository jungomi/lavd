import React, { createContext, useContext, useEffect } from "react";
import * as styles from "./Overlay.styles";

export const OverlayContext = createContext({
  show: (_: JSX.Element | Array<JSX.Element> | undefined) => {},
  hide: () => {}
});

export const Overlay: React.FC = ({ children }) => {
  const overlay = useContext(OverlayContext);
  useEffect(() => {
    const pressEscape = (e: KeyboardEvent) => {
      if (children && e.key === "Escape") {
        overlay.hide();
      }
    };
    window.addEventListener("keydown", pressEscape);
    // Clean up when the component is destroyed
    return () => {
      window.removeEventListener("keydown", pressEscape);
    };
  }, [overlay, children]);
  return (
    <div className={children ? styles.overlay : styles.overlayHidden}>
      <div className={styles.close}>
        <span
          className={styles.closeIcon}
          onClick={() => overlay.hide()}
        ></span>
      </div>
      {children}
    </div>
  );
};