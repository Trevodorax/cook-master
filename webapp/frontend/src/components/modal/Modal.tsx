import { MouseEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import cx from "classnames";

import styles from "./Modal.module.scss";

interface Props {
  backdropClassName?: string;
  children: ReactNode;
  isOpen: boolean;
  modalClassName?: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Modal = ({
  backdropClassName,
  children,
  isOpen,
  modalClassName,
  setIsOpen,
}: Props) => {
  const handleBackdropClick = () => {
    setIsOpen(false);
  };

  const handleModalClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const root = document.getElementById("root");

  if (!root) {
    return <></>;
  }

  return createPortal(
    <>
      {isOpen && (
        <>
          <div
            className={cx(styles.container, modalClassName)}
            onClick={handleModalClick}
          >
            {children}
          </div>
          <div
            className={cx(styles.backdrop, backdropClassName)}
            onClick={handleBackdropClick}
          />
        </>
      )}
    </>,
    root // Pass root as the second argument to createPortal
  );
};
