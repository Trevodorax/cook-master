import React, { FC } from "react";
import Layout from "@/components/layout/Layout";
import "@/styles/globals.scss";
import { Provider } from "react-redux";
import { store } from "@/store/store";

interface Props {
  Component: FC;
  pageProps: any;
}

export default function Index({ Component, pageProps }: Props) {
  return (
    <Provider store={store}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
