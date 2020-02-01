import { css } from "emotion";
import React, { useEffect, useState } from "react";
import { fetchUrl } from "./api";
import { LazyData, Optional } from "./data";
import { Spinner } from "./Spinner";

const spinnerClass = css({
  display: "flex",
  marginLeft: "1.2rem"
});

type Props<T> = {
  data: Optional<T | LazyData>;
  children?: (data: T) => JSX.Element | null;
};

export function DataLoader<T>({ data, children }: Props<T>) {
  // If api is present, it is LazyData (in fact just the api property is the
  // LazyData), otherwise it's type T.
  // To make TypeScript happy, the api property is always added, but overwritten
  // with the actual api value if that is present, and then separated from the
  // rest, which is cast to type T, since that can only be T.
  const { api, ...rest } = { api: undefined, ...data };
  const [toFetch, setToFetch] = useState(api ? api.url : undefined);
  const [loadedData, setLoadedData] = useState<Optional<T>>(
    api ? undefined : (rest as T)
  );
  useEffect(() => {
    if (toFetch) {
      fetchUrl<T>(toFetch).then(d => {
        setLoadedData(d);
        setToFetch(undefined);
      });
    }
  }, [toFetch]);
  if (loadedData === undefined) {
    return (
      <div className={spinnerClass}>
        <Spinner />
      </div>
    );
  } else {
    return children ? children(loadedData) : null;
  }
}
