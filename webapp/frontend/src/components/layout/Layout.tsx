import React, { ReactNode, useState } from "react";
import Header from "@/components/header/Header";
import styles from "./Layout.module.scss";
import Head from "next/head";

interface Props {
  children: ReactNode;
}

export default function Layout({ children }: Props) {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false);

  return (
    <div id="root" className={styles.container}>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <link
          rel="icon"
          href="/icon.svg"
          type="image/<generated>"
          sizes="<generated>"
        />
        <title>Cook Master</title>
      </Head>
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
