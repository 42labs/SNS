import { useStarknetInvoke } from "@starknet-react/core";
import { useRegistryContract } from "./registry";
import { AddTransactionResponse } from "starknet";

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
