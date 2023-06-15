import React, { ReactNode, useState } from "react";
import Header from "@/components/header/Header";
import styles from "./Layout.module.scss";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  return (
    <div id="root" className={styles.container}>
      <Header
        isNavigationOpen={isNavigationOpen}
        setIsNavigationOpen={setIsNavigationOpen}
      />
      <div
        className={styles.content}
        onClick={() => setIsNavigationOpen(false)}
      >
        {children}
      </div>
    </div>
  );
}
