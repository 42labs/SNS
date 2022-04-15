import {
  useStarknet,
  useStarknetCall,
  useStarknetInvoke,
} from "@starknet-react/core";
import React, { useState } from "react";
import { StyledTextInput } from "../NameInput";
import { encodeStrAsListOfFelts } from "../../../utils/felt";
import { ManageNameProps } from "./ManageName";
import { truncateAddress } from "../../services/address.service";
import { toHex } from "starknet/utils/number";
import Button from "../Button";
import { StyledExternalLink } from "../StyledLink";
import { buildExplorerUrlForTransaction } from "../../services/wallet.service";
import { useResolverContract } from "../../hooks/starknet_address_resolver";

const ChangeStarknetAddress = ({ name, record }: ManageNameProps) => {
  const [starknetAddressSubmission, setStarknetAddressSubmission] =
    useState<string>();
  const { account } = useStarknet();
  if (!account) {
    console.log("uh oh");
    return null;
  }
  console.log("account", account);
  const { contract: resolverContract } = useResolverContract(
    record.resolverAddress
  );
  const args = [encodeStrAsListOfFelts(name)];
  const getStarknetAddressResult = useStarknetCall({
    contract: resolverContract,
    method: "get_starknet_address_by_name",
    args,
  });
  const setStarknetAddressResult = useStarknetInvoke<Array<string | string[]>>({
    contract: resolverContract,
    method: "set_starknet_address_by_name",
  });

  let starknetAddress: string | undefined = undefined;
  if (getStarknetAddressResult.data !== undefined) {
    starknetAddress = toHex(getStarknetAddressResult.data[0]);
  }

  const handleSetStarknetAddress = (event) => {
    event.preventDefault();

    const encodedName = encodeStrAsListOfFelts(name);
    const newStarknetAddress = event.target[0].value;
    const args = [encodedName, newStarknetAddress];
    setStarknetAddressResult.invoke({ args });
    setStarknetAddressSubmission(newStarknetAddress);

    console.log("EVENT", event, "args", args);

    setStarknetAddressResult.reset();
  };

  const transactionId = setStarknetAddressResult.data;
  console.log("setStarknetAddressResult", setStarknetAddressResult);

  console.log("Resolver", record.resolverAddress);

  return (
    <div className="my-4 text-base">
      {starknetAddressSubmission === undefined ? (
        <div>
          <div>
            Current value:{" "}
            {getStarknetAddressResult.loading ||
            (getStarknetAddressResult.error === undefined &&
              starknetAddress === undefined)
              ? "Loading..."
              : getStarknetAddressResult.error !== undefined
              ? "Error. Check the console for logs and try again later."
              : truncateAddress(starknetAddress)}{" "}
          </div>
          <div>
            Set to:{" "}
            <form
              onSubmit={handleSetStarknetAddress}
              className="m-auto w-full text-center inline"
            >
              <StyledTextInput className="mx-2" />
            </form>
          </div>
        </div>
      ) : transactionId ? (
        <div className="my-4">
          Congratulations, your registration has been submitted!
          <div>
            The transaction ID is {truncateAddress(transactionId)}.{" "}
            <StyledExternalLink
              href={buildExplorerUrlForTransaction(transactionId)}
              target="_blank"
            >
              View on Voyager
            </StyledExternalLink>
          </div>
          <div className="my-6">
            Your submission was:
            <table className="my-2 mx-auto text-left ">
              <tr>
                <td className="pr-4">New Starknet Address:</td>
                <td> {truncateAddress(starknetAddressSubmission)}</td>
              </tr>
            </table>
          </div>
        </div>
      ) : (
        "Error"
      )}
    </div>
  );
};

export default ChangeStarknetAddress;
