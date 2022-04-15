import { pedersen } from "starknet/dist/utils/hash";

export const charToFelt = (str: string): number => str.charCodeAt(0);

export const encodeStrAsListOfFelts = (input: string): number[] => {
  const inputList = input.split("");
  const outputList = inputList.map(charToFelt);
  return outputList;
};

export const hashName = (name: string) => {
  if (name.length === 0) {
    return 0;
  }
  const recursiveHash = hashName(name.slice(1));
  return pedersen([charToFelt(name[0]), recursiveHash]);
};
