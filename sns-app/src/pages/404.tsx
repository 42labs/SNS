import React from "react";
import { StyledInternalLink } from "../components/StyledLink";

const Custom404Page = () => (
  <div className="text-center">
    <div className="text-3xl mt-2">404 | Page not found</div>
    <div className="my-4">
      <StyledInternalLink href="/">Take me home</StyledInternalLink>
    </div>
  </div>
);

export default Custom404Page;
