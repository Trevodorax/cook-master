import { ChangeEvent, KeyboardEventHandler } from "react";
import cx from "classnames";

import { CursorIcon, KeyIcon, LetterIcon, PhoneIcon } from "../svgs";

import styles from "./TextInput.module.scss";

interface Props {
  className?: string;
  value: string;
  setValue: (value: string) => void;
  type: "text" | "email" | "password" | "tel";
  placeholder?: string;
  icon?: React.ReactNode;
  hideIcon?: boolean;
  label?: string;
  onEnter?: () => void;
}

export const TextInput = ({
  className = "",
  value,
  setValue,
  type,
  placeholder = "",
  icon,
  hideIcon = false,
  label = "",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onEnter = () => {},
}: Props) => {
  const handleChange = (e: ChangeEvent) => {
    setValue((e.target as HTMLInputElement).value);
  };

  const handleKeyDown = (event: KeyboardEventHandler<HTMLInputElement>) => {
    if (event.key === "Enter") {
      onEnter();
    }
  };

  const iconsPerType = {
    text: <CursorIcon />,
    email: <LetterIcon />,
    password: <KeyIcon />,
    tel: <PhoneIcon />,
  };

  return (
    <div className={cx(styles.container, className)}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.field}>
        {!hideIcon && (
          <div className={styles.icon}>{icon ?? iconsPerType[type]}</div>
        )}
        <input
          className={styles.input}
          type={type}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
};
