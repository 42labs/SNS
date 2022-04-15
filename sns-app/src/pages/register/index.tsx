import React from "react";
import { useRouter } from "next/router";
import Button from "../../components/Button";
import { NameInputWithPrompt } from "../../components/NameInput";
import { StyledInternalLink } from "../../components/StyledLink";
import AddressDisplay from "../../components/AddressDisplay";
import ActionButton from "../../components/ActionButton";
import { WalletProps } from "../_app";
import Wallet from "../../components/Wallet";
import { useRecord } from "../../hooks/record";

interface NameSectionProps {
  name: string;
  onInputSubmit: (name: string) => void;
}

const NameSection = ({ name, onInputSubmit }: NameSectionProps) => {
  const recordHook = useRecord(name);

  return (
    <div className="my-6">
      <div className="text-center text-xl">
        <AddressDisplay name={name} recordHook={recordHook} />
        {recordHook.record && recordHook.record.ownerAddress === "0x0" && (
          <div className="text-center mb-2 mt-4">
            <ActionButton
              pagePath={"/register/submit?name=" + name}
              text="Register it now 🚀"
            />
          </div>
        )}
      </div>
      <NameInputWithPrompt
        onInputSubmit={onInputSubmit}
        prompt="Search another name"
      />
    </div>
  );
};

const RegisterPage = ({ walletProps }: { walletProps: WalletProps }) => {
  const router = useRouter();

  const { name } = router.query;

  const handleRegisterName = (name: string) => {
    router.push("/register?name=" + encodeURI(name));
  };

  return (
    <div>
      <div className="my-4">
        {!walletProps.isConnected && (
          <div className="mx-auto text-center">
            <div className="block mx-auto my-2 text-xl">
              Connect your wallet in order to register a new name.
            </div>
            <Button onClick={walletProps.handleConnectClick}>
              Connect Wallet
            </Button>
            <div className="mt-6">
              You can also search domain names{" "}
              <StyledInternalLink href="/search">here</StyledInternalLink>.
            </div>
          </div>
        )}
        {name && typeof name === "string" ? (
          <NameSection
            key={name}
            name={name}
            onInputSubmit={handleRegisterName}
          />
        ) : (
          walletProps.isConnected && (
            <NameInputWithPrompt
              onInputSubmit={handleRegisterName}
              prompt="Enter the name you would like to register"
            />
          )
        )}
        <Wallet {...walletProps} />
      </div>
    </div>
  );
};

export default RegisterPage;
