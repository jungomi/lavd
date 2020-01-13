import React, { CSSProperties } from "react";
import { Colour, colourString } from "./colour/definition";
import * as styles from "./Card.styles";

type CardProps = {
  name: string;
  colour: Colour;
  category?: string;
  style?: CSSProperties;
  className?: string;
};

export const Card: React.FC<CardProps> = ({
  category,
  name,
  colour,
  style,
  className = styles.card,
  children
}) => {
  return (
    <div className={className}>
      <div className={styles.title} style={style}>
        <span className={styles.category}>{category}</span>
        <span className={styles.name} style={{ color: colourString(colour) }}>
          {name}
        </span>
      </div>
      {children}
    </div>
  );
};
