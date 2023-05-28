import React, { FC } from "react";
import { Provider } from "react-redux";

import { RedirectionWrapper } from "@/store/redirection/RedirectionWrapper";
import { store } from "@/store/store";
import Layout from "@/components/layout/Layout";
import { LocalStorageProvider } from "@/wrappers/LocalStorageProvider";
import "@/styles/globals.scss";
import { Toaster } from "react-hot-toast";

interface Props {
  Component: FC;
  pageProps: any;
}

export default function Index({ Component, pageProps }: Props) {
  return (
    <Provider store={store}>
      <LocalStorageProvider>
        <RedirectionWrapper>
          <Layout>
            <Toaster />
            <Component {...pageProps} />
          </Layout>
        </RedirectionWrapper>
      </LocalStorageProvider>
    </Provider>
  );
}
