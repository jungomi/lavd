import React from "react";
import { EmptyLoading, SmallEmptyLoading } from "./Empty";
import * as styles from "./Spinner.styles";

export const Spinner: React.FC = () => <div className={styles.spinner} />;

export const Loading: React.FC = () => (
  <div className={styles.loading}>
    <EmptyLoading />
    <div className={styles.loadingSpinner}>
      <Spinner />
    </div>
  </div>
);

export const SmallLoading: React.FC = () => (
  <div className={styles.loading}>
    <SmallEmptyLoading />
    <div className={styles.loadingSpinner}>
      <Spinner />
    </div>
  </div>
);
