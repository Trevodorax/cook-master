import React, { FC } from "react";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import "@/locales/i18n";
import { RedirectionWrapper } from "@/store/redirection/RedirectionWrapper";
import { store } from "@/store/store";
import Layout from "@/components/layout/Layout";
import { LocalStorageProvider } from "@/wrappers/LocalStorageProvider";
import "@/styles/globals.scss";
import { I18nextProvider } from "react-i18next";
import i18n from "@/locales/i18n";

const stripePromise = loadStripe(
  "pk_test_51NJeJKBzPmJlbME74bi9K2j3yJ2Txedv3tiNZE2MJdXcyNF01dpkDBMLwwB1s4BpNWeqJ8J8PdwuIsOMkwudJRmE00BXNPOzIc"
);

interface Props {
  Component: FC;
  pageProps: any;
}

export default function Index({ Component, pageProps }: Props) {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <LocalStorageProvider>
          <RedirectionWrapper>
            <Elements stripe={stripePromise}>
              <Layout>
                <Toaster />
                <Component {...pageProps} />
              </Layout>
            </Elements>
          </RedirectionWrapper>
        </LocalStorageProvider>
      </I18nextProvider>
    </Provider>
  );
}
