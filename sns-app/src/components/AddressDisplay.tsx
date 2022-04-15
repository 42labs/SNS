import React from "react";
import { truncateAddress } from "../services/address.service";
import { buildExplorerUrlForAddress } from "../services/wallet.service";
import { StyledExternalLink } from "./StyledLink";
import { RecordHookT } from "../hooks/record";

interface AddressDisplayProps {
  name: string;
  recordHook: RecordHookT;
  className?: string;
}

const AddressDisplay = ({
  name,
  recordHook,
  className,
}: AddressDisplayProps) => {
  const { record, loading, error } = recordHook;

  if (error !== undefined) {
    console.error("Error displaying address for name", name, ":", error);
  }

  const nameElement = <div className="font-semibold inline">{name}</div>;
  const addressIsRegistered = record?.ownerAddress === "0x0";

  return (
    <div className={className}>
      {loading || (error === undefined && record === undefined) ? (
        <div className="inline">Loading address for {nameElement}...</div>
      ) : error !== undefined ? (
        <div className="inline">Error fetching address for {nameElement}.</div>
      ) : (
        <div className="inline">
          {addressIsRegistered ? (
            <div>{nameElement} is not registered.</div>
          ) : (
            <div>
              {nameElement} belongs to address:{" "}
              {truncateAddress(record?.ownerAddress)}.{" "}
              <StyledExternalLink
                href={buildExplorerUrlForAddress(record?.ownerAddress)}
                target="_blank"
              >
                View on Voyager
              </StyledExternalLink>
              .
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressDisplay;
