import { useContract, useStarknetInvoke } from "@starknet-react/core";
import { Abi, AddTransactionResponse } from "starknet";
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

export interface RegisterHookT {
  transactionId: string;
  loading: boolean;
  error: string;
  reset: () => void;
  invoke: ({
    args,
  }: {
    args: (string | string[])[];
  }) => Promise<AddTransactionResponse>;
}

export const useRegister = (): RegisterHookT => {
  const { contract } = useRegistryContract();
  const {
    data: transactionId,
    loading,
    error,
    reset,
    invoke,
  } = useStarknetInvoke<Array<string | string[]>>({
    contract,
    method: "register",
  });

  return { transactionId, loading, error, reset, invoke };
};
