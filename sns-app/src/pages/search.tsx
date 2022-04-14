import React from "react";
import { useRouter } from "next/router";
import { NameInput } from "../components/NameInput";
import AddressDisplay from "../components/AddressDisplay";

const SearchPage = () => {
  const router = useRouter();

  const { name } = router.query;

  const handleNameInputSubmit = (name: string) => {
    router.push("search/?name=" + encodeURI(name));
  };

  return (
    <div>
      {name == undefined ? (
        <div>
          <div className="text-center mx-auto">
            Enter a name below to find out who owns it
          </div>
        </div>
      ) : (
        <div>
          {typeof name === "string" && (
            <AddressDisplay
              key={name}
              name={name}
              className="text-center mx-auto text-lg my-8"
            />
          )}
        </div>
      )}
      <NameInput
        handleInputSubmit={handleNameInputSubmit}
        placeHolderText={name && "Search another name"}
      />
    </div>
  );
};

export default SearchPage;
