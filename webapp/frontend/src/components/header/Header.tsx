import React, { useState } from "react";
import cx from "classnames";

import Navigation from "@/components/navigation/Navigation";
import { MainLogo } from "@/components/svgs";
import { BurgerIcon } from "@/components/svgs";

import styles from "./Header.module.scss";

interface Props {
  isNavigationOpen: boolean;
  setIsNavigationOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Header({
  isNavigationOpen,
  setIsNavigationOpen,
}: Props) {
  const toggleNavigation = () => {
    setIsNavigationOpen((isOpen) => !isOpen);
  };

  return (
    <header className={styles.container}>
      <div className={styles.mainLogo}>
        <MainLogo />
      </div>
      <h1 className={styles.title}>Cook Master</h1>
      <div
        className={cx(styles.burgerIcon, {
          [styles.open]: isNavigationOpen,
        })}
        onClick={toggleNavigation}
      >
        <BurgerIcon />
      </div>
      <Navigation
        containerClassname={cx(styles.navigationContainer, {
          [styles.open]: isNavigationOpen,
        })}
        itemsClassname={styles.navigationItem}
      />
    </header>
  );
}
