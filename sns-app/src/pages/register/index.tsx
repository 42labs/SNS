import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { NameInput } from "../../components/NameInput";
import { truncateAddress } from "../../services/address.service";
import {
  addWalletChangeListener,
  connectWallet,
  isPreauthorized,
  isWalletConnected,
  networkId,
  walletAddress,
} from "../../services/wallet.service";
import { StyledInternalLink } from "../../components/StyledLink";
import AddressDisplay from "../../components/AddressDisplay";
import ActionButton from "../../components/ActionButton";

const RegisterPage = () => {
  const [isConnected, setIsConnected] = useState(isWalletConnected());
  const [address, setAddress] = useState<string>();
  const router = useRouter();

  const { name } = router.query;

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

  const handleRegisterName = (name: string) => {
    router.push("/register?name=" + encodeURI(name));
  };

  const nameInputWithPrompt = (prompt: string) => (
    <div className="mb-12">
      <div className="mt-8 text-xl text-center">{prompt}</div>
      <NameInput handleInputSubmit={handleRegisterName} />
    </div>
  );

  const childrenIfNameNotRegistered = (
    <div className="text-center mb-2 mt-4">
      <ActionButton
        pagePath={"/register/submit?name=" + name}
        text="Register it now"
      />
    </div>
  );

  return (
    <div>
      <div className="my-4">
        {!isConnected && (
          <div className="mx-auto text-center">
            <div className="block mx-auto my-2 text-xl">
              Connect your wallet in order to register a new name.
            </div>
            <Button onClick={handleConnectClick}>Connect Wallet</Button>
            <div className="mt-6">
              You can also search domain names{" "}
              <StyledInternalLink href="/search">here</StyledInternalLink>.
            </div>
          </div>
        )}
        {name ? (
          <div className="my-6">
            <div className="text-center text-xl">
              {typeof name === "string" && (
                <AddressDisplay
                  name={name}
                  childrenIfAddressDoesNotExist={childrenIfNameNotRegistered}
                />
              )}
            </div>

            {nameInputWithPrompt("Search another name")}
          </div>
        ) : (
          isConnected &&
          nameInputWithPrompt("Enter the name you would like to register")
        )}
        {!!isConnected && (
          <div className="mx-auto">
            <div>
              <div className="text-center text-xl mb-2">Wallet connected!</div>
              <div className="text-center">
                Address: <code>{address && truncateAddress(address)}</code>
              </div>
              <div className="text-center">Network: {networkId()}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterPage;
