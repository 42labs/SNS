import React, { useState } from "react";
import Button from "../../components/Button";
import ChangeStarknetAddress from "./ChangeStarknetAddress";
import ChangeOwnerAddress from "./ChangeOwnerAddress";
import { RegistryRecord } from "../../interfaces/record";
import { StyledExternalLink } from "../StyledLink";

export interface ManageNameProps {
  name: string;
  record: RegistryRecord;
}

const ManageName = ({ name, record }: ManageNameProps) => {
  const [selectedAction, setSelectedAction] = useState<string | undefined>();
  const getClickHandler = (action: string) => () => {
    setSelectedAction(action);
  };
  return (
    <div className="text-center my-8">
      <div className="text-2xl my-6 inline">
        Manage <div className="font-semibold inline">{name}</div>
        {selectedAction !== undefined && (
          <div className="my-4 inline">{" - " + selectedAction}</div>
        )}
      </div>
      {selectedAction === undefined ? (
        <div className="my-4">
          <Button onClick={getClickHandler("Change Starknet Address")}>
            Change Starknet Address
          </Button>
          <Button onClick={getClickHandler("Change Owner Address")}>
            Transfer Name
          </Button>
          {/* <Button onClick={getClickHandler("Change Resolver Address")}>
              Change Resolver Address
            </Button>
            <Button>Register Subdomain (Coming Soon!)</Button>*/}
        </div>
      ) : (
        <div className="flex flex-col max-w-md mx-auto my-2 text-xl">
          {selectedAction === "Change Starknet Address" ? (
            <ChangeStarknetAddress name={name} record={record} />
          ) : selectedAction === "Change Owner Address" ? (
            <ChangeOwnerAddress name={name} record={record} />
          ) : (
            <div>Unknown action selected</div>
          )}
          <div
            onClick={() => setSelectedAction(undefined)}
            className="text-base"
          >
            {" "}
            <StyledExternalLink>Select a different action</StyledExternalLink>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageName;
