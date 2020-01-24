import React, { createContext, useContext, useEffect } from "react";
import * as styles from "./Overlay.styles";

export const OverlayContext = createContext({
  show: (_: JSX.Element | Array<JSX.Element> | undefined) => {},
  hide: () => {}
});

export const Overlay: React.FC = ({ children }) => {
  const overlay = useContext(OverlayContext);
  const pressEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      overlay.hide();
    }
  };
  useEffect(() => {
    window.addEventListener("keydown", pressEscape);
    // Clean up when the component is destroyed
    return () => {
      window.removeEventListener("keydown", pressEscape);
    };
  });
  return (
    <div className={styles.overlay}>
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
