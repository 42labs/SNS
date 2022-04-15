import React, { ReactNode } from "react";
import { useRouter } from "next/router";
import { NameInput } from "../../components/NameInput";
import AddressDisplay from "../../components/AddressDisplay";
import { truncateAddress } from "../../services/address.service";
import Button from "../../components/Button";
import { StyledInternalLink } from "../../components/StyledLink";
import ManageName from "../../components/ManageName/ManageName";
import { WalletProps } from "../_app";
import { useRecord } from "../../hooks/record";
import Wallet from "../../components/Wallet";

interface NameSectionProps {
  name: string;
  walletAddress: string;
  nameInput: ReactNode;
}

const NameSection = ({ name, walletAddress, nameInput }: NameSectionProps) => {
  const recordHook = useRecord(name);

  return (
    <div>
      <AddressDisplay
        key={name}
        name={name}
        className="text-center mx-auto my-4"
        recordHook={recordHook}
      />
      {recordHook.record &&
        walletAddress !== undefined &&
        recordHook.record.ownerAddress !== undefined &&
        (recordHook.record.ownerAddress === "0x0" ? (
          <div className="text-center w-6/12 mx-auto">
            <div>
              Looks like you {name} is not registered yet. Click{" "}
              <StyledInternalLink href={"/register/?name=" + name}>
                here
              </StyledInternalLink>{" "}
              to claim it!
            </div>
            {nameInput}
          </div>
        ) : recordHook.record.ownerAddress !== walletAddress ? (
          <div className="text-center w-6/12 mx-auto">
            <div>
              ❗ Oops, looks like you don&#39;t own {name}. This domain is
              registered under {truncateAddress(recordHook.record.ownerAddress)}
              , but you are connected with address{" "}
              {truncateAddress(walletAddress)}. Please{" "}
              <div className="inline font-semibold">
                connect the wallet that owns this name
              </div>{" "}
              before proceeding, or search a different name.
            </div>
            {nameInput}
          </div>
        ) : (
          <ManageName name={name} record={recordHook.record} />
        ))}
    </div>
  );
};

const ManagePage = ({ walletProps }: { walletProps: WalletProps }) => {
  const router = useRouter();

  const { name } = router.query;

  const handleNameInputSubmit = (name: string) => {
    router.push("manage/?name=" + encodeURI(name));
  };

  const nameInput = (
    <NameInput
      onInputSubmit={handleNameInputSubmit}
      placeHolderText={name && "Search another name"}
    />
  );

  return (
    <div>
      {!walletProps.isConnected ? (
        <div className="mx-auto text-center">
          <div className="block mx-auto my-2 text-xl">
            Connect your wallet in order to manage your names.
          </div>
          <Button onClick={walletProps.handleConnectClick}>
            Connect Wallet
          </Button>
          <div className="mt-6">
            You can also search domain names{" "}
            <StyledInternalLink href="/search">here</StyledInternalLink>.
          </div>
        </div>
      ) : name == undefined || typeof name !== "string" ? (
        <div>
          <div className="text-center mx-auto text-xl">
            Enter a name below to manage the registration
          </div>
        </div>
      ) : (
        <NameSection
          name={name}
          walletAddress={walletProps.address}
          nameInput={nameInput}
        />
      )}
      {!name && walletProps.isConnected && nameInput}
      <Wallet {...walletProps} />
    </div>
  );
};

export default ManagePage;
