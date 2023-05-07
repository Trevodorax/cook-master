import cx from "classnames";
import { ReactNode } from "react";

import styles from "./Button.module.scss";

interface Props {
  children: ReactNode;
  className?: string;
  type: "primary" | "secondary" | "error" | "warning" | "ok";
  isFormSubmit: boolean;
}

export const Button = ({
  children,
  className = "",
  type,
  isFormSubmit,
}: Props) => {
  return (
    <button
      type={isFormSubmit ? "submit" : undefined}
      className={cx(styles.button, className, styles[type])}
    >
      {children}
    </button>
  );
};
