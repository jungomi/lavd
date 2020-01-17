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
      <div className={styles.content}>{children}</div>
    </div>
  );
};

type CategoryCardProps = {
  category: string;
  style?: CSSProperties;
  className?: string;
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  style,
  className = styles.categoryCard,
  children
}) => {
  return (
    <div className={className}>
      <div className={styles.categoryTitle} style={style}>
        <span className={styles.category}>{category}</span>
      </div>
      <div className={styles.categoryContent}>{children}</div>
    </div>
  );
};
