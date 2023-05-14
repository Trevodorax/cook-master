import { ChangeEvent } from "react";
import cx from "classnames";

import { CursorIcon, KeyIcon, LetterIcon, PhoneIcon } from "../svgs";

import styles from "./TextInput.module.scss";

interface Props {
  className?: string;
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  type: "text" | "email" | "password" | "tel";
  placeholder?: string;
  icon?: React.ReactNode;
  hideIcon?: boolean;
}

export const TextInput = ({
  className = "",
  value,
  setValue,
  type,
  placeholder = "",
  icon,
  hideIcon = false,
}: Props) => {
  const handleChange = (e: ChangeEvent) => {
    setValue((e.target as HTMLInputElement).value);
  };

  const iconsPerType = {
    text: <CursorIcon />,
    email: <LetterIcon />,
    password: <KeyIcon />,
    tel: <PhoneIcon />,
  };

  return (
    <div className={cx(styles.container, className)}>
      {!hideIcon && (
        <div className={styles.icon}>{icon ?? iconsPerType[type]}</div>
      )}
      <input
        className={styles.input}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </div>
  );
};
