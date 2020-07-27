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
  const debouncedFilterValue = useDebounce(filterValue, delay);

  useEffect(() => {
    const filter =
      debouncedFilterValue === ""
        ? undefined
        : new RegExp(debouncedFilterValue);
    updateFilter(filter);
  }, [debouncedFilterValue, updateFilter]);

  return (
    <div className={styles.inputContainer}>
      <input
        placeholder={placeholder === undefined ? "Filter (Regex)" : placeholder}
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
  );
};
