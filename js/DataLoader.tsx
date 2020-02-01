import React, { useEffect, useState } from "react";
import { fetchUrl } from "./api";
import { LazyData, Optional } from "./data";
import * as styles from "./DataLoader.styles";
import { Spinner } from "./Spinner";

const Failed: React.FC = () => (
  <div className={styles.failed}>Failed to load</div>
);

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
    let cancelled = false;
    const controller = new AbortController();
    if (toFetch) {
      fetchUrl<T>(toFetch, controller)
        .then(d => {
          if (!cancelled) {
            setLoadedData(d);
            setToFetch(undefined);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setLoadedData(undefined);
            setToFetch(undefined);
          }
        });
    }
    return () => {
      cancelled = true;
      controller.abort();
    };
  });
  if (loadedData === undefined) {
    if (toFetch === undefined) {
      return <Failed />;
    } else {
      return (
        <div className={styles.spinner}>
          <Spinner />
        </div>
      );
    }
  } else {
    return children ? children(loadedData) : null;
  }
}
