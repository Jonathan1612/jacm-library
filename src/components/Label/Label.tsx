import styles from "./Label.module.css";

interface LabelProps {
  name: string;
  type: "primary" | "secondary" | "normal";
  size: "small" | "large" | "medium";
}

const Label = ({ name, type = "normal", size = "small" }: LabelProps) => {
  return <span className={`${styles[type]}  ${styles[size]}`}>{name}</span>;
};

export default Label;
