import React from "react";
import Button from "./Button";
import { useRouter } from "next/router";

interface ActionButtonProps {
  pagePath: string;
  text: string;
}

const ActionButton = ({ pagePath, text }: ActionButtonProps) => {
  const router = useRouter();

  return <Button onClick={() => router.push(pagePath)}>{text}</Button>;
};

export default ActionButton;
