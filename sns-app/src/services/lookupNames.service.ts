import { Record } from "../interfaces/record";

export const getRecordForName = (name: string): Record => {
  const record = {
    owner_addr: "1",
    resolver_addr: "2",
    apex_namehash: "3",
  };
  return record;
};
