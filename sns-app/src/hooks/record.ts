import { useStarknetCall } from "@starknet-react/core";
import { toHex } from "starknet/utils/number";
import { encodeStrAsListOfFelts } from "../../utils/felt";
import { RegistryRecord } from "../interfaces/record";
import { useRegistryContract } from "./registry";

export interface RecordHookT {
  record: RegistryRecord;
  loading: boolean;
  error: string;
}

export const useRecord = (name: string): RecordHookT => {
  const { contract } = useRegistryContract();
  const args = [encodeStrAsListOfFelts(name)];
  const { data, loading, error } = useStarknetCall({
    contract,
    method: "get_record_by_name",
    args,
  });
  let record: RegistryRecord | undefined = undefined;
  if (data !== undefined) {
    record = {
      ownerAddress: toHex(data[0].owner_addr),
      resolverAddress: toHex(data[0].resolver_addr),
      apexNamehash: toHex(data[0].apex_namehash),
    };
  }
  return { record, loading, error };
};
