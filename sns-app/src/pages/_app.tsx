import React from "react";
import { AppProps } from "next/app";
import { StarknetProvider } from "@starknet-react/core";

import "../styles/index.css";
import SNSFooter from "../components/SNSFooter";
import SNSHeader from "../components/SNSHeader";

const MyApp = ({ Component, pageProps }: AppProps) => (
  <StarknetProvider>
    <div className="bg-violet-300 min-h-screen">
      <SNSHeader />
      <Component {...pageProps} />
      <SNSFooter />
    </div>
  </StarknetProvider>
);

export default MyApp;
