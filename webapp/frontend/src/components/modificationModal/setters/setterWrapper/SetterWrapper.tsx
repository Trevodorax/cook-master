import { Button } from "@/components/button/Button";
import { UseMutation } from "@reduxjs/toolkit/dist/query/react/buildHooks";
import { FC, ReactNode } from "react";

import styles from "./SetterWrapper.module.scss";

interface Props {
  value: any;
  useMutation: UseMutation<any>;
  setIsOpen: (isOpen: boolean) => void;
  children: ReactNode;
}

export const SetterWrapper: FC<Props> = ({
  value,
  useMutation,
  setIsOpen,
  children,
}) => {
  const [mutate, { isLoading }] = useMutation();

  const handleSave = () => {
    mutate(value);
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
          <span>Save</span>
        </Button>
        <Button onClick={handleClose}>
          <span>Close</span>
        </Button>
      </div>
    </div>
  );
};
