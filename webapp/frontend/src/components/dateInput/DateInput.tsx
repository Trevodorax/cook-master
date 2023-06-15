import { ChangeEvent } from "react";
import cx from "classnames";

import { CalendarIcon } from "../svgs";

import styles from "./DateInput.module.scss";

interface Props {
  className?: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  hideIcon?: boolean;
  label?: string;
}

export const DateInput = ({
  className = "",
  value,
  setValue,
  hideIcon = false,
  label = "",
}: Props) => {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className={cx(styles.container, className)}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.field}>
        {!hideIcon && (
          <div className={styles.icon}>
            <CalendarIcon />
          </div>
        )}
        <input
          className={styles.input}
          type="datetime-local"
          value={value}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};
