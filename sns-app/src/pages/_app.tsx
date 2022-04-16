import React, { useEffect, useState } from "react";
import { AppProps } from "next/app";
import { InjectedConnector, StarknetProvider } from "@starknet-react/core";

import "../styles/index.css";
import SNSFooter from "../components/SNSFooter";
import SNSHeader from "../components/SNSHeader";
import {
  addWalletChangeListener,
  connectWallet,
  isPreauthorized,
  isWalletConnected,
  walletAddress,
} from "../services/wallet.service";
import { useRouter } from "next/router";

export interface WalletProps {
  isConnected: boolean;
  address: string;
  handleConnectClick: () => void;
}

const MyApp = ({ Component, pageProps }: AppProps) => {
  const connectors = [new InjectedConnector()];

  const [isConnected, setIsConnected] = useState(isWalletConnected());
  const [address, setAddress] = useState<string>();
  const router = useRouter();

  useEffect(() => {
    try {
      addWalletChangeListener((accounts) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
        } else {
          setAddress("");
          setIsConnected(false);
        }
      });
    } catch {
      router.push("/");
    }
  }, []);

  useEffect(() => {
    (async () => {
      if (await isPreauthorized()) {
        await handleConnectClick();
      }
    })();
  }, []);

  const handleConnectClick = async () => {
    await connectWallet();
    setIsConnected(isWalletConnected());
    setAddress(await walletAddress());
  };

  return (
    <StarknetProvider autoConnect connectors={connectors}>
      <div className="bg-violet-300 min-h-screen flex flex-col justify-start">
        <SNSHeader />
        <Component
          walletProps={{ isConnected, address, handleConnectClick }}
          {...pageProps}
        />
        <SNSFooter />
      </div>
    </StarknetProvider>
  );
};

export default MyApp;
