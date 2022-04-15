import {
  useContract,
  useStarknetCall,
  useStarknetInvoke,
} from "@starknet-react/core";
import { Abi } from "starknet";
import { toHex } from "starknet/utils/number";
import { encodeStrAsListOfFelts } from "../../utils/felt";
import ResolverAbi from "../abi/starknet_address_resolver.json";

export const useResolverContract = (resolverAddress: string) =>
  useContract({
    abi: ResolverAbi as Abi,
    address: resolverAddress,
  });

export interface StarknetAddressHookT {
  starknetAddress: string | undefined;
  loading: boolean;
  error: string;
}

export const useStarknetAddress = (
  resolverAddress: string,
  name: string
): StarknetAddressHookT => {
  const { contract } = useResolverContract(resolverAddress);
  const args = [encodeStrAsListOfFelts(name)];
  const { data, loading, error } = useStarknetCall({
    contract,
    method: "get_starknet_address_by_name",
    args,
  });
  let starknetAddress: string | undefined = undefined;
  if (data !== undefined) {
    starknetAddress = toHex(data[0]);
  }
  return { starknetAddress, loading, error };
};

export const useStarknetAddressResultSetter = (resolverAddress: string) => {
  const { contract } = useResolverContract(resolverAddress);
  return useStarknetInvoke<Array<string | string[]>>({
    contract,
    method: "set_starknet_address_by_name",
  });
};
