import React, { FC } from "react";
import Layout from "@/components/layout/Layout";
import "@/styles/globals.scss";

interface Props {
  Component: FC;
  pageProps: any;
}

export default function Index({ Component, pageProps }: Props) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}
