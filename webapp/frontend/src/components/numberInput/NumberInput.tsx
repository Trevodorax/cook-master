import { ChangeEvent } from "react";
import cx from "classnames";

import styles from "./NumberInput.module.scss";

interface Props {
  className?: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  label?: string;
}

export const NumberInput = ({
  className = "",
  value,
  setValue,
  label = "",
}: Props) => {
  const handleChange = (e: ChangeEvent) => {
    setValue((e.target as HTMLInputElement).value);
  };

  return (
    <div className={cx(styles.container, className)}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.field}>
        <input
          type="number"
          className={styles.input}
          value={value}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};
