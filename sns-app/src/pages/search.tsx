import React from "react";
import { useRouter } from "next/router";
import { NameInput } from "../components/NameInput";
import AddressDisplay from "../components/AddressDisplay";
import { useRecord } from "../hooks/record";

interface NameSectionProps {
  name: string;
}

const NameSection = ({ name }: NameSectionProps) => {
  const recordHook = useRecord(name);

  return (
    <AddressDisplay
      name={name}
      className="text-center mx-auto text-lg my-8"
      recordHook={recordHook}
    />
  );
};

const SearchPage = () => {
  const router = useRouter();

  const { name } = router.query;

  const handleNameInputSubmit = (name: string) => {
    router.push("search/?name=" + encodeURI(name));
  };

  return (
    <div>
      {name == undefined || typeof name !== "string" ? (
        <div>
          <div className="text-center mx-auto">
            Enter a name below to find out who owns it
          </div>
        </div>
      ) : (
        <NameSection key={name} name={name} />
      )}
      <NameInput
        onInputSubmit={handleNameInputSubmit}
        placeHolderText={name && "Search another name"}
      />
    </div>
  );
};

export default SearchPage;
