import { Button } from "@/components/button/Button";
import { FC, ReactNode } from "react";

import styles from "./SetterWrapper.module.scss";
import { useTranslation } from "react-i18next";

interface Props {
  value: any;
  mutateValue: (value: any) => void;
  setIsOpen: (isOpen: boolean) => void;
  children: ReactNode;
}

export const SetterWrapper: FC<Props> = ({
  value,
  mutateValue,
  setIsOpen,
  children,
}) => {
  const { t } = useTranslation();
  const handleSave = () => {
    mutateValue(value);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>{children}</div>
      <hr />
      <div className={styles.bottomButtons}>
        <Button onClick={handleSave}>
          <span>{t("save")}</span>
        </Button>
        <Button onClick={handleClose}>
          <span>{t("close")}</span>
        </Button>
      </div>
    </div>
  );
};
