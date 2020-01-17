import React from "react";
import { Colour, colourString } from "./colour/definition";
import * as styles from "./Card.styles";

type CardProps = {
  name: string;
  colour: Colour;
  className?: string;
  titleClass?: string;
};

export const Card: React.FC<CardProps> = ({
  name,
  colour,
  className = styles.card,
  titleClass = styles.title,
  children
}) => {
  return (
    <div className={className}>
      <div className={titleClass}>
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
  contentClass?: string;
};

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  contentClass = styles.categoryContent,
  children
}) => {
  return (
    <div className={styles.categoryCard}>
      <div className={styles.categoryTitle}>
        <span className={styles.category}>{category}</span>
      </div>
      <div className={contentClass}>{children}</div>
    </div>
  );
};
