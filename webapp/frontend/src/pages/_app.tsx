import React, { FC } from "react";
import { Provider } from "react-redux";

import { RedirectionWrapper } from "@/store/redirection/RedirectionWrapper";
import Layout from "@/components/layout/Layout";
import { store } from "@/store/store";
import "@/styles/globals.scss";

interface Props {
  Component: FC;
  pageProps: any;
}

export default function Index({ Component, pageProps }: Props) {
  return (
    <Provider store={store}>
      <RedirectionWrapper>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </RedirectionWrapper>
    </Provider>
  );
}
