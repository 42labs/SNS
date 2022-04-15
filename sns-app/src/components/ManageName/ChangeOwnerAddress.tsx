import React from "react";
import { StyledTextInput } from "../NameInput";
import { ManageNameProps } from "./ManageName";

const ChangeOwnerAddress = ({ name }: ManageNameProps) => {
  return (
    <div>
      <div>Current value:</div>{" "}
      <div>
        Set to: <StyledTextInput className="mx-2" />
      </div>
    </div>
  );
};

export default ChangeOwnerAddress;
