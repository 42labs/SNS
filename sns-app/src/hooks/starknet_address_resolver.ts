import { useContract } from "@starknet-react/core";
import { Abi } from "starknet";
import ResolverAbi from "../abi/starknet_address_resolver.json";

export const useResolverContract = (resolverAddress: string) =>
  useContract({
    abi: ResolverAbi as Abi,
    address: resolverAddress,
  });
