import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";
import RegistryAbi from "../abi/registry.json";
import { getRegistryAddress } from "../services/address.service";
import { networkId } from "../services/wallet.service";

export const useRegistryContract = () => {
  const network = networkId();
  const registryContractAddress = getRegistryAddress(network);
  return useContract({
    abi: RegistryAbi as Abi,
    address: registryContractAddress,
  });
};
