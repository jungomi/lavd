import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import * as styles from "./QuickSettings.styles";

const CogWheel: React.FC<{ className: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className={className}
  >
    <path d="M13.85 22.25h-3.7c-.74 0-1.36-.54-1.45-1.27l-.27-1.89c-.27-.14-.53-.29-.79-.46l-1.8.72c-.7.26-1.47-.03-1.81-.65L2.2 15.53c-.35-.66-.2-1.44.36-1.88l1.53-1.19c-.01-.15-.02-.3-.02-.46 0-.15.01-.31.02-.46l-1.52-1.19c-.59-.45-.74-1.26-.37-1.88l1.85-3.19c.34-.62 1.11-.9 1.79-.63l1.81.73c.26-.17.52-.32.78-.46l.27-1.91c.09-.7.71-1.25 1.44-1.25h3.7c.74 0 1.36.54 1.45 1.27l.27 1.89c.27.14.53.29.79.46l1.8-.72c.71-.26 1.48.03 1.82.65l1.84 3.18c.36.66.2 1.44-.36 1.88l-1.52 1.19c.01.15.02.3.02.46s-.01.31-.02.46l1.52 1.19c.56.45.72 1.23.37 1.86l-1.86 3.22c-.34.62-1.11.9-1.8.63l-1.8-.72c-.26.17-.52.32-.78.46l-.27 1.91c-.1.68-.72 1.22-1.46 1.22zm-3.23-2h2.76l.37-2.55.53-.22c.44-.18.88-.44 1.34-.78l.45-.34 2.38.96 1.38-2.4-2.03-1.58.07-.56c.03-.26.06-.51.06-.78s-.03-.53-.06-.78l-.07-.56 2.03-1.58-1.39-2.4-2.39.96-.45-.35c-.42-.32-.87-.58-1.33-.77l-.52-.22-.37-2.55h-2.76l-.37 2.55-.53.21c-.44.19-.88.44-1.34.79l-.45.33-2.38-.95-1.39 2.39 2.03 1.58-.07.56a7 7 0 0 0-.06.79c0 .26.02.53.06.78l.07.56-2.03 1.58 1.38 2.4 2.39-.96.45.35c.43.33.86.58 1.33.77l.53.22.38 2.55z" />
    <circle cx="12" cy="12" r="3.5" />
  </svg>
);

// Preview with dummy elements to showcase the theme
// Theme is applied by setting the data-theme of the root
// of this little preview, which overwrites the general theme.
const ThemePreview: React.FC<{ className: string; theme: "light" | "dark" }> =
  ({ className, theme }) => (
    <div className={className} data-theme={theme}>
      <div className={styles.previewHeader}>
        <div className={styles.headerTextActive} />
        <div className={styles.headerText} />
        <div className={styles.headerText} />
        <div className={styles.previewSettings}>
          <CogWheel className={styles.previewIcon} />
        </div>
      </div>
      <div className={styles.previewLine}>
        <div className={styles.circle} />
        <div className={styles.textLine} />
      </div>
      <div className={styles.previewLine}>
        <div className={styles.circle} />
        <div className={styles.textLine} />
      </div>
    </div>
  );

export const QuickSettings: React.FC = () => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");
  const selectTheme = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value === "system") {
      document.documentElement.removeAttribute("data-theme");
    } else {
      document.documentElement.setAttribute("data-theme", e.target.value);
    }
    setTheme(e.target.value);
    localStorage.setItem("theme", e.target.value);
  };
  useEffect(() => {
    const outsideClick = (e: MouseEvent) => {
      if (
        isOpen &&
        e.button === 0 &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    const pressEscape = (e: KeyboardEvent) => {
      if (isOpen && e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("click", outsideClick);
    window.addEventListener("keydown", pressEscape);
    // Clean up when the component is destroyed
    return () => {
      window.removeEventListener("click", outsideClick);
      window.removeEventListener("keydown", pressEscape);
    };
  });

  return (
    <div className={styles.settings}>
      <button
        className={styles.settingsButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <CogWheel className={styles.settingsIcon} />
      </button>
      <div className={isOpen ? styles.panelOpen : styles.panel} ref={panelRef}>
        <h2 className={styles.title}>Settings</h2>
        <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
          <span className={styles.closeIcon}></span>
        </button>
        <div className={styles.themes}>
          <h3 className={styles.themeTitle}>Theme</h3>
          <div className={styles.themesList}>
            <div className={styles.theme}>
              <label className={styles.label}>
                <ThemePreview className={styles.themePreview} theme="light" />
                <div className={styles.labelDescription}>
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={theme === "light"}
                    onChange={selectTheme}
                    className={styles.radio}
                  />
                  <span className={styles.labelText}>Light</span>
                </div>
              </label>
            </div>
            <div className={styles.theme}>
              <label className={styles.label}>
                <ThemePreview className={styles.themePreview} theme="dark" />
                <div className={styles.labelDescription}>
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    checked={theme === "dark"}
                    onChange={selectTheme}
                    className={styles.radio}
                  />
                  <span className={styles.labelText}>Dark</span>
                </div>
              </label>
            </div>
            <div className={styles.theme}>
              <label className={styles.label}>
                <ThemePreview
                  className={styles.themePreviewUpperHalf}
                  theme="light"
                />
                <ThemePreview className={styles.themePreview} theme="dark" />
                <div className={styles.labelDescription}>
                  <input
                    type="radio"
                    name="theme"
                    value="system"
                    checked={theme === "system"}
                    onChange={selectTheme}
                    className={styles.radio}
                  />
                  <span className={styles.labelText}>System</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
