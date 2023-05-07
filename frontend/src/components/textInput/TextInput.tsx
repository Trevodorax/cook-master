import { ChangeEvent } from "react";

import { CursorIcon, KeyIcon, LetterIcon, PhoneIcon } from "../svgs";

import styles from "./TextInput.module.scss";

interface Props {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  type: "text" | "email" | "password" | "tel";
  placeholder?: string;
}

export const TextInput = ({
  value,
  setValue,
  type,
  placeholder = "",
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
    <div className={styles.container}>
      <div className={styles.icon}>{iconsPerType[type]}</div>
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
