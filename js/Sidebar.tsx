import React, { useEffect, useRef, useState } from "react";
import { ColourPicker } from "./colour/ColourPicker";
import { fieldHeight } from "./colour/ColourPicker.styles";
import {
  Colour,
  ColourMap,
  colourString,
  defaultColour,
} from "./colour/definition";
import { Optional } from "./data";
import { EmptyDash, SmallEmpty } from "./Empty";
import { useDebounce } from "./hook/debounce";
import * as styles from "./Sidebar.styles";
import { SmallLoading } from "./Spinner";

export type Names = {
  active: Array<string>;
  inactive: Array<string>;
};

export type FilteredNames = {
  active: Array<string>;
  inactive: Array<string>;
  activeVisible: Array<string>;
  inactiveVisible: Array<string>;
};

export const VisibilityIcon: React.FC<{ visible?: boolean }> = ({
  visible,
}) => (
  <svg
    className={
      visible ? styles.visibilityIconShown : styles.visibilityIconHidden
    }
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
  >
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
    <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 001 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
  </svg>
);

type ShownColourpicker = {
  name: string;
  offset: number;
};

type Props = {
  names: FilteredNames;
  setNames: (names: Names) => void;
  setNameFilter: (filter: Optional<RegExp>) => void;
  colours: ColourMap;
  setColour: (name: string, colour: Colour) => void;
  loading: boolean;
};

export const Sidebar: React.FC<Props> = ({
  names,
  setNames,
  setNameFilter,
  colours,
  setColour,
  loading,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [shownColourPicker, setShownColourPicker] = useState<
    ShownColourpicker | undefined
  >(undefined);
  const mediaQuery = window.matchMedia("(min-width: 896px)");
  const [shown, setShown] = useState(mediaQuery.matches);
  const toggle = () => setShown(!shown);
  useEffect(() => {
    const updateShown = () => setShown(mediaQuery.matches);
    // Update when the media media query is toggled.
    mediaQuery.addListener(updateShown);
    return () => {
      mediaQuery.removeListener(updateShown);
    };
  });
  const [filterValue, setFilterValue] = useState<string>("");
  const debouncedFilterValue = useDebounce(filterValue, 300);
  useEffect(() => {
    const filter =
      debouncedFilterValue === ""
        ? undefined
        : new RegExp(debouncedFilterValue);
    setNameFilter(filter);
  }, [debouncedFilterValue, setNameFilter]);

  const showColourPicker = (name: string, clientY: number) => {
    if (listRef.current !== null) {
      const { top, height } = listRef.current.getBoundingClientRect();
      const y = clientY - top + 24;
      const offset = Math.min(y, height - 2 * fieldHeight);
      setShownColourPicker({ name, offset });
    }
  };
  const hideAll = () => {
    setNames({
      active: [],
      inactive: [...names.active, ...names.inactive].sort(),
    });
  };
  const showAll = () => {
    setNames({
      active: [...names.active, ...names.inactive].sort(),
      inactive: [],
    });
  };
  const hideName = (name: string) => {
    setNames({
      active: names.active.filter((n) => n !== name),
      inactive: [...names.inactive, name].sort(),
    });
  };
  const showName = (name: string) => {
    setNames({
      active: [...names.active, name].sort(),
      inactive: names.inactive.filter((n) => n !== name),
    });
  };

  const activeNameList = names.activeVisible.map((name) => {
    const colour: Colour = colours.get(name) || defaultColour;
    return (
      <div key={name} className={styles.entry}>
        <span
          className={styles.colour}
          style={{ background: colourString(colour) }}
          onClick={(e) => showColourPicker(name, e.clientY)}
        />
        <span className={styles.entryName}>{name}</span>
        <span className={styles.visibility} onClick={() => hideName(name)}>
          <VisibilityIcon visible={true} />
        </span>
      </div>
    );
  });
  const inactiveNameList = names.inactiveVisible.map((name) => {
    const colour: Colour = colours.get(name) || defaultColour;
    return (
      <div key={name} className={styles.hiddenEntry}>
        <span
          className={styles.colour}
          style={{ background: colourString(colour) }}
          onClick={(e) => showColourPicker(name, e.clientY)}
        />
        <span className={styles.entryName}>{name}</span>
        <span className={styles.visibility} onClick={() => showName(name)}>
          <VisibilityIcon visible={false} />
        </span>
      </div>
    );
  });
  const hasData = names.active.length > 0 || names.inactive.length > 0;
  const hasVisibleData =
    activeNameList.length > 0 || inactiveNameList.length > 0;

  const nameLists = (
    <>
      {shownColourPicker && (
        <ColourPicker
          colour={colours.get(shownColourPicker.name) || defaultColour}
          onSelect={(colour) => {
            setShownColourPicker(undefined);
            setColour(shownColourPicker.name, colour);
          }}
          style={{ top: shownColourPicker.offset }}
        />
      )}
      <div className={styles.nameListGroup}>
        <span className={styles.title}>Active</span>
        <span className={styles.visibilityAll} onClick={() => hideAll()}>
          <VisibilityIcon visible={true} />
        </span>
        {activeNameList.length > 0 ? (
          <div className={styles.nameList}>{activeNameList}</div>
        ) : (
          <EmptyDash />
        )}
      </div>
      <div className={styles.nameListGroup}>
        <span className={styles.title}>Inactive</span>
        <span className={styles.visibilityAll} onClick={() => showAll()}>
          <VisibilityIcon visible={false} />
        </span>
        {inactiveNameList.length > 0 ? (
          <div className={styles.nameList}>{inactiveNameList}</div>
        ) : (
          <EmptyDash />
        )}
      </div>
    </>
  );
  return (
    <div className={shown ? styles.sidebar : styles.sidebarHidden}>
      <svg
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        className={shown ? styles.toggle : styles.toggleHidden}
        onClick={toggle}
      >
        <path d="M11.727 26.71l9.977-9.999a1.012 1.012 0 000-1.429l-9.97-9.991c-.634-.66-1.748-.162-1.723.734v19.943c-.023.893 1.083 1.377 1.716.742zm7.84-10.713l-7.55 7.566V8.431l7.55 7.566z" />
      </svg>
      {loading ? (
        <SmallLoading />
      ) : (
        <div
          className={shown ? styles.nameListContainer : styles.nameListHidden}
          ref={listRef}
        >
          <div className={styles.inputContainer}>
            <input
              placeholder="Filter Experiments (Regex)"
              className={styles.input}
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") {
                  setFilterValue("");
                }
              }}
            />
            {filterValue !== "" && (
              <div
                className={styles.inputRemoveControls}
                onClick={() => setFilterValue("")}
              >
                <span className={styles.plus}></span>
              </div>
            )}
          </div>
          {hasVisibleData ? (
            nameLists
          ) : (
            <SmallEmpty
              text={hasData ? "data matching filter" : "data available"}
            />
          )}
        </div>
      )}
    </div>
  );
};
