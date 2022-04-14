import React from "react";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import classNames from "classnames";

const Button = (
  props: DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >
) => {
  const className = classNames(
    "mx-8 my-4 inline py-4 px-6 border border-solid border-violet-900 rounded-lg text-lg float hover:bg-violet-900 hover:text-white hover:cursor-pointer",
    props.className
  );
  return <button {...props} className={className}></button>;
};

export default Button;
