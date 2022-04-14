import React, { useState } from "react";
import { useContract, useStarknetCall } from "@starknet-react/core";
import {
  getRegistryAddress,
  truncateAddress,
} from "../services/address.service";
import {
  buildExplorerUrlForAddress,
  networkId,
} from "../services/wallet.service";
import RegistryAbi from "../abi/registry.json";
import { Abi } from "starknet";
import { encodeStrAsListOfFelts } from "../../utils/felt";
import { bigNumberishArrayToDecimalStringArray } from "starknet/utils/number";
import { StyledExternalLink } from "./StyledLink";

interface AddressDisplayProps {
  name: string;
  className?: string;
}

const AddressDisplay = ({ name, className }: AddressDisplayProps) => {
  const network = networkId();
  const registryContractAddress = getRegistryAddress(network);
  const { contract } = useContract({
    abi: RegistryAbi as Abi,
    address: registryContractAddress,
  });
  const args = [encodeStrAsListOfFelts(name)];
  const { data, loading, error } = useStarknetCall({
    contract,
    method: "get_record_by_name",
    args,
  });

  if (error !== undefined) {
    console.log("Error displaying address for name", name, ":", error);
  }

  let ownerAddr: string | undefined = undefined;
  if (data !== undefined) {
    ownerAddr = bigNumberishArrayToDecimalStringArray([data[0].owner_addr])[0];
  }

  const nameElement = <div className="font-semibold inline">{name}</div>;

  return (
    <div className={className}>
      {loading || (error === undefined && data === undefined) ? (
        <div className="inline">Loading address for {nameElement}.</div>
      ) : error ? (
        <div className="inline">Error fetching address for {nameElement}.</div>
      ) : (
        <div className="inline">
          {ownerAddr === "0" ? (
            <div>{nameElement} is not registered.</div>
          ) : (
            <div>
              {nameElement} belongs to address: {truncateAddress(ownerAddr)}.{" "}
              <StyledExternalLink
                href={buildExplorerUrlForAddress(ownerAddr)}
                target="_blank"
              >
                View on Voyager
              </StyledExternalLink>
              .
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressDisplay;
