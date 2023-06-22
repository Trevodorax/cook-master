import { MouseEvent, ReactNode } from "react";
import { createPortal } from "react-dom";
import cx from "classnames";

import styles from "./Modal.module.scss";

interface Props {
  backdropClassName?: string;
  children: ReactNode;
  isOpen: boolean;
  modalClassName?: string;
  setIsOpen: (isOpen: boolean) => void;
}

export const Modal = ({
  backdropClassName,
  children,
  isOpen,
  modalClassName,
  setIsOpen,
}: Props) => {
  // because of issues with "document is not defined"
  if (typeof document === "undefined") {
    return <></>;
  }
  const root = document?.getElementById("root") || null;

  if (root === null) {
    return <></>;
  }
  const handleBackdropClick = () => {
    setIsOpen(false);
  };

  const handleModalClick = (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

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
