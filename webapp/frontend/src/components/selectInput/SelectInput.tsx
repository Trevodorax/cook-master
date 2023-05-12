import cx from "classnames";

import styles from "./SelectInput.module.scss";

interface Props {
  className?: string;
  defaultIndex?: number;
  options: Array<string>;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
}

export const SelectInput = ({
  className = "",
  defaultIndex,
  options,
  value,
  setValue,
}: Props) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(event.target.value);
  };

  if (defaultIndex !== undefined) {
    options = [
      options[defaultIndex],
      ...options.filter((_, index) => index !== defaultIndex),
    ];
  }

  return (
    <select
      value={value}
      onChange={handleChange}
      className={cx(styles.select, className)}
    >
      {options.map((option, index) => {
        return (
          <option key={index} value={option} className={styles.option}>
            {option}
          </option>
        );
      })}
    </select>
  );
};
