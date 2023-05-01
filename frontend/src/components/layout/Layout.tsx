import React, { ReactNode } from "react";
import Header from "@/components/header/Header";
import styles from "./Layout.module.scss";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className={styles.container}>
      <Header />
      {children}
    </div>
  );
}
