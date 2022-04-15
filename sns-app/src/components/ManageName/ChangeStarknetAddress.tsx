import React, { useState } from "react";
import { StyledTextInput } from "../NameInput";
import { encodeStrAsListOfFelts } from "../../../utils/felt";
import { ManageNameProps } from "./ManageName";
import { truncateAddress } from "../../services/address.service";
import Button from "../Button";
import { StyledExternalLink } from "../StyledLink";
import { buildExplorerUrlForTransaction } from "../../services/wallet.service";
import {
  useStarknetAddress,
  useStarknetAddressResultSetter,
} from "../../hooks/starknet_address_resolver";

const ChangeStarknetAddress = ({ name, record }: ManageNameProps) => {
  const [starknetAddressSubmission, setStarknetAddressSubmission] =
    useState<string>();

  const starknetAddress = useStarknetAddress(record.resolverAddress, name);
  const setStarknetAddressResult = useStarknetAddressResultSetter(
    record.resolverAddress
  );

  const handleSetStarknetAddress = (event) => {
    event.preventDefault();

    const encodedName = encodeStrAsListOfFelts(name);
    const newStarknetAddress = event.target[0].value;
    const args = [encodedName, newStarknetAddress];
    setStarknetAddressResult.invoke({ args });
    setStarknetAddressSubmission(newStarknetAddress);
  };

  const transactionId = setStarknetAddressResult.data;

  return (
    <div className="my-4 text-base">
      {starknetAddressSubmission === undefined ? (
        <div>
          <div>
            Current value:{" "}
            {starknetAddress.loading ||
            (starknetAddress.error === undefined &&
              starknetAddress.starknetAddress === undefined)
              ? "Loading..."
              : starknetAddress.error !== undefined
              ? `Error getting current Starknet address (resolver ${record.resolverAddress}).`
              : truncateAddress(starknetAddress.starknetAddress)}{" "}
          </div>
          <div>
            Set to:{" "}
            <form
              onSubmit={handleSetStarknetAddress}
              className="m-auto w-full text-center inline"
            >
              <StyledTextInput className="mx-2" />
              <Button>Update Address</Button>
            </form>
          </div>
        </div>
      ) : transactionId ? (
        <div className="my-4">
          Congratulations, your update has been submitted!
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
      ) : setStarknetAddressResult.loading ? (
        "Loading..."
      ) : (
        "Error"
      )}
    </div>
  );
};

export default ChangeStarknetAddress;
