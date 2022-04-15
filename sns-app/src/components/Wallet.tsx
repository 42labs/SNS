import React from "react";
import { WalletProps } from "../pages/_app";
import { truncateAddress } from "../services/address.service";
import { networkId } from "../services/wallet.service";

const Wallet = (walletProps: WalletProps) => {
  return (
    !!walletProps.isConnected && (
      <div className="mx-auto">
        <div>
          <div className="text-center text-xl mb-2">Wallet connected!</div>
          <div className="text-center">
            Address:{" "}
            <code>
              {walletProps.address && truncateAddress(walletProps.address)}
            </code>
          </div>
          <div className="text-center">Network: {networkId()}</div>
        </div>
      </div>
    )
  );
};

export default Wallet;
