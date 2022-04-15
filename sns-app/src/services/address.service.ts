import { encode } from "starknet";
import { Network } from "./wallet.service";

export const formatAddress = (address: string) =>
  encode.addHexPrefix(encode.removeHexPrefix(address).padStart(64, "0"));

export const truncateAddress = (fullAddress: string) => {
  const address = formatAddress(fullAddress);

  const hex = address.slice(0, 2);
  const start = address.slice(2, 6);
  const end = address.slice(-4);
  return `${hex} ${start} ... ${end}`;
};

const GOERLI_DEFAULT_REGISTRY_CONTRACT_ADDRESS = "0x05ab97cc647943dd0354b7b9073ceed535c3fdc24cc8fbd072979a7897982503";

export const getRegistryAddress = (network: Network): string => {
  if (network == "mainnet-alpha") {
    throw new Error("Not deployed on mainnet yet");
  } else if (network === "goerli-alpha") {
    return GOERLI_DEFAULT_REGISTRY_CONTRACT_ADDRESS;
  } else if (network === "localhost") {
    throw new Error(
      "Unknown contract address on localhost. Add address in `src/services/address.service.ts"
    );
  } else {
    throw new Error("Unknown network type");
  }
};

export const GOERLI_DEFAULT_RESOLVER_CONTRACT_ADDRESS =
  "0x071597a3a4a96d7ed00d4643cd44ea7123c00756ebe0ccc8694ea0a0db2a7635";

  export const getResolverAddress = (network: Network): string => {
    if (network == "mainnet-alpha") {
      throw new Error("Not deployed on mainnet yet");
    } else if (network === "goerli-alpha") {
      return GOERLI_DEFAULT_RESOLVER_CONTRACT_ADDRESS;
    } else if (network === "localhost") {
      throw new Error(
        "Unknown contract address on localhost. Add address in `src/services/address.service.ts"
      );
    } else {
      throw new Error("Unknown network type");
    }
  };