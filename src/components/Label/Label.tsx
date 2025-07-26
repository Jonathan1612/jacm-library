import React from "react";
import styles from "./Label.module.css";

export interface LabelProps {
  name: string;
  variant: "primary" | "secondary" | "normal";
  size: "small" | "large" | "medium";
}

const Label = ({ name, variant = "primary", size = "small" }: LabelProps) => {
  return <span className={`${styles[variant]}  ${styles[size]}`}>{name}</span>;
};

export default Label;
