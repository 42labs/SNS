import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { StyledInternalLink } from "./StyledLink";

const SNSHeader = () => {
  const { pathname } = useRouter();

  const pages = pathname === "/" ? [""] : pathname.split("/");

  return (
    <div className="my-4 mx-6">
      {pages.map((page, i) => {
        const text =
          page === "" ? "Home" : page[0].toUpperCase() + page.slice(1);
        const separator = i === pages.length - 1 ? "" : " < ";
        return (
          <div className="inline" key={page + i.toString()}>
            {i === pages.length - 1 ? (
              text
            ) : (
              <StyledInternalLink
                href={"/" + pages.slice(pages.length - i).join("/")}
              >
                {text}
              </StyledInternalLink>
            )}
            {separator}
          </div>
        );
      })}
      <div className="flex p-8 pt-16 pb-8">
        <Link href="/">
          <div className="text-center text-6xl m-auto cursor-pointer">
            Starknet Name Service
          </div>
        </Link>
      </div>
    </div>
  );
};

export default SNSHeader;
