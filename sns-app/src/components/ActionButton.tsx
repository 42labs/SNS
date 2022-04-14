import React from "react";
import Link from "next/link";
import Button from "./Button";

interface ActionButtonProps {
  pagePath: string;
  text: string;
}

const ActionButton = ({ pagePath, text }: ActionButtonProps) => (
  <Link href={pagePath}>
    <Button>{text}</Button>
  </Link>
);

export default ActionButton;
