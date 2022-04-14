export const charToFelt = (str: string): number => str.charCodeAt(0);

export const encodeStrAsListOfFelts = (input: string): number[] => {
  const inputList = input.split("");
  const outputList = inputList.map(charToFelt);
  return outputList;
};
