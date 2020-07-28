import React, { useEffect, useState } from "react";
import { useDebounce } from "./hook/debounce";
import * as styles from "./Filter.styles";

type FilterProps = {
  updateFilter: (regex?: RegExp) => void;
  placeholder?: string;
  delay?: number;
};

export const Filter: React.FC<FilterProps> = ({
  updateFilter,
  placeholder,
  delay = 300,
}) => {
  const [filterValue, setFilterValue] = useState<string>("");
  const [invalid, setInvalid] = useState(false);
  const debouncedFilterValue = useDebounce(filterValue, delay);

  useEffect(() => {
    try {
      const filter =
        debouncedFilterValue === ""
          ? undefined
          : new RegExp(debouncedFilterValue);
      updateFilter(filter);
      setInvalid(false);
    } catch {
      setInvalid(true);
    }
  }, [debouncedFilterValue, updateFilter]);

  return (
    <div className={styles.inputContainer}>
      <input
        placeholder={placeholder === undefined ? "Filter (Regex)" : placeholder}
        className={invalid ? styles.inputInvalid : styles.input}
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
          <span className={invalid ? styles.crossInvalid : styles.cross}></span>
        </div>
      )}
    </div>
  );
};
