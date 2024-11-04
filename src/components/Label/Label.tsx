import React from "react";
import styles from "./Label.module.css";

export interface LabelProps {
  name: string;
  type: "primary" | "secondary" | "normal";
  size: "small" | "large" | "medium";
}

const Label = ({ name, type = "normal", size = "small" }: LabelProps) => {
  return <span className={`${styles[type]}  ${styles[size]}`}>{name}</span>;
};

export default Label;
