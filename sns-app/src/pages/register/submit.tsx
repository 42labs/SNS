import { useRouter } from "next/router";
import React, { FormEvent, useEffect, useState } from "react";
import Button from "../../components/Button";
import { StyledTextInput } from "../../components/NameInput";
import {
  StyledExternalLink,
  StyledInternalLink,
} from "../../components/StyledLink";
import { truncateAddress } from "../../services/address.service";
import { buildExplorerUrlForTransaction } from "../../services/wallet.service";
import { encodeStrAsListOfFelts, hashName } from "../../../utils/felt";
import { RegistrySubmission } from "../../interfaces/record";
import { useRegister } from "../../hooks/registry";
import { DEFAULT_RESOLVER_CONTRACT_ADDRESS } from "../../hooks/starknet_address_resolver";

const SubmitPage = () => {
  const [registrySubmission, setRegistrySubmission] =
    useState<RegistrySubmission>();
  const { transactionId, loading, error, reset, invoke } = useRegister();
  const router = useRouter();
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
    const resolverAddress = DEFAULT_RESOLVER_CONTRACT_ADDRESS; // event.target[1].value;
    const registrationYears = event.target[1].value;
    const args = [
      encodedName,
      ownerAddress,
      resolverAddress,
      registrationYears,
    ];
    invoke({ args });
    setRegistrySubmission({
      name: name,
      ownerAddress: ownerAddress,
      resolverAddress: resolverAddress,
      registrationYears: registrationYears,
      apexNamehash: hashName(name), // TODO: Need to update once subdomains allowed
    });
  };

  const inputClassName = "block mx-auto";

  if (error) {
    console.error("Error submitting registration transaction", error);
  }

  return (
    <div className="text-center">
      <div className="text-3xl my-8">
        {!loading && transactionId === undefined
          ? "Register"
          : error === undefined
          ? "Registering"
          : "Failed to register"}{" "}
        <div className="font-semibold inline">{name}</div>
        <div className="text-base my-2">
          Want to register{" "}
          {error === undefined && registrySubmission && transactionId
            ? "another"
            : "a different"}{" "}
          name? Click{" "}
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
              <td> {truncateAddress(registrySubmission.ownerAddress)}</td>
              <tr>
                <td className="pr-4">Resolver:</td>
                <td> {truncateAddress(registrySubmission.resolverAddress)}</td>
              </tr>
              <td className="pr-4">Registration Period:</td>
              <td>
                {" "}
                {registrySubmission.registrationYears} year
                {registrySubmission.registrationYears > 1 ? "s" : ""}
              </td>
            </table>
          </div>
          <div>
            Once the transaction is confirmed you can manage your name{" "}
            <StyledInternalLink
              href={"/manage/?name=" + registrySubmission.name}
            >
              here
            </StyledInternalLink>
            .
          </div>
        </div>
      ) : error !== undefined ? (
        <div>
          Error! Check the console for detailed logs, and try again in a few
          minutes.
        </div>
      ) : (
        <div />
      )}
      {!registrySubmission && !transactionId && (
        <div className="flex">
          <form
            onSubmit={handleSubmit}
            className="m-auto w-full text-center flex-column"
          >
            <StyledTextInput
              placeholder={"Owner address"}
              className={inputClassName}
            ></StyledTextInput>
            {/*
              <StyledTextInput
                placeholder={"Resolver address"}
                className={inputClassName}
              ></StyledTextInput>*/}
            <StyledTextInput
              placeholder={"Registration period (years, max 10)"}
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
