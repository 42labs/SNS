import { useContract, useStarknetInvoke } from "@starknet-react/core";
import { useRouter } from "next/router";
import React, { FormEvent, useEffect, useState } from "react";
import { Abi } from "starknet";
import Button from "../../components/Button";
import { StyledTextInput } from "../../components/NameInput";
import {
  StyledExternalLink,
  StyledInternalLink,
} from "../../components/StyledLink";
import {
  getRegistryAddress,
  truncateAddress,
} from "../../services/address.service";
import {
  buildExplorerUrlForTransaction,
  networkId,
} from "../../services/wallet.service";
import RegistryAbi from "../../abi/registry.json";
import { encodeStrAsListOfFelts } from "../../../utils/felt";
import { RegistrySubmission } from "../../interfaces/record";

const SubmitPage = () => {
  const [registrySubmission, setRegistrySubmission] =
    useState<RegistrySubmission>();
  const router = useRouter();
  const network = networkId();
  const registryContractAddress = getRegistryAddress(network);
  const { contract } = useContract({
    abi: RegistryAbi as Abi,
    address: registryContractAddress,
  });
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

  const { name } = router.query;

  useEffect(() => {
    if (name == undefined || typeof name !== "string") {
      router.push("/register");
    }
    reset();
  }, [name]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (typeof name !== "string") {
      console.error("ERROR: name not a string", name);
      return;
    }
    const encodedName = encodeStrAsListOfFelts(name);
    const ownerAddress = event.target[0].value;
    const resolverAddress = event.target[1].value;
    const registrationYears = event.target[2].value;
    setRegistrySubmission({
      name: name,
      owner_addr: ownerAddress,
      resolver_addr: resolverAddress,
      registration_years: registrationYears,
      apex_namehash: "0",
    });
    const args = [
      encodedName,
      ownerAddress,
      resolverAddress,
      registrationYears,
    ];
    invoke({ args });
  };

  const inputClassName = "block mx-auto";

  if (error) {
    console.error("Error submitting registration transaction", error);
  }

  return (
    <div className="text-center">
      <div className="text-2xl my-8">
        {!loading && transactionId === undefined
          ? "Register"
          : error === undefined
          ? "Registering"
          : "Failed to register"}{" "}
        <div className="font-semibold inline">{name}</div>
        <div className="text-base my-2">
          Want to register a different name? Click{" "}
          <StyledInternalLink href="/register">here</StyledInternalLink>.
        </div>
      </div>
      {!loading && transactionId === undefined ? (
        <div>
          <div>Fill out the fields below to complete your registration.</div>
        </div>
      ) : error === undefined && registrySubmission && transactionId ? (
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
                <td className="pr-4">Name:</td>
                <td> {registrySubmission.name}</td>
              </tr>
              <td className="pr-4">Owner:</td>
              <td> {truncateAddress(registrySubmission.owner_addr)}</td>
              <tr>
                <td className="pr-4">Resolver:</td>
                <td> {truncateAddress(registrySubmission.resolver_addr)}</td>
              </tr>
              <td className="pr-4">Registration Period:</td>
              <td> {registrySubmission.registration_years} year</td>
            </table>
          </div>
        </div>
      ) : (
        <div>
          Error! Check the console for detailed logs, and try again in a few
          minutes.
        </div>
      )}

      {!registrySubmission && !transactionId && (
        <div className="flex my-6">
          <form
            onSubmit={handleSubmit}
            className="m-auto w-full text-center flex-column"
          >
            <StyledTextInput
              placeholder={"Owner address"}
              className={inputClassName}
            ></StyledTextInput>
            <StyledTextInput
              placeholder={"Resolver address"}
              className={inputClassName}
            ></StyledTextInput>
            <StyledTextInput
              placeholder={"Registration period (years)"}
              className={inputClassName}
            ></StyledTextInput>
            <input type="submit" className="hidden" />
            <Button>Register</Button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SubmitPage;
