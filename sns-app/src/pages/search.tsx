import React from "react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import NameInput from "../components/NameInput";
import SNSHeader from "../components/SNSHeader";
import { getRecordForName } from "../services/lookupNames.service";
import { Record } from "../interfaces/record";

const SearchPage = () => {
  const [record, setRecord] = useState<Record | undefined>();
  const router = useRouter();

  const { name } = router.query;

  const handleNameInputSubmit = (name: string) => {
    router.push("search/?name=" + encodeURI(name));
    const record = getRecordForName(name);
    setRecord(record);
  };

  useEffect(() => {
    if (typeof name === "string") {
      const record = getRecordForName(name);
      setRecord(record);
    }
  }, [name]);

  return (
    <div>
      <SNSHeader />
      {name == undefined ? (
        <div>
          <div className="text-center mx-auto">
            Enter a name below to find out who owns it
          </div>
        </div>
      ) : (
        <div>
          <div className="text-center mx-auto text-lg my-8">
            <div className="font-semibold inline">{name}</div> belongs to
            address {record?.owner_addr}
          </div>
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
