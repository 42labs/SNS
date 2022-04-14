import classNames from "classnames";
import React from "react";
import { FormEvent } from "react";

interface NameInputProps {
  handleInputSubmit: (name: string) => void;
  placeHolderText?: string;
}

export const StyledTextInput = (
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) => (
  <input
    type="text"
    {...props}
    className={classNames(
      "placeholder-purple-500 py-2 px-4 my-4 rounded-lg text-lg w-4/12 max-w-3xl",
      props.className
    )}
  ></input>
);

export const NameInput = ({
  handleInputSubmit,
  placeHolderText,
}: NameInputProps) => {
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = event.target[0].value;
    handleInputSubmit(text);
    event.target[0].value = "";
    event.target[0].blur();
  };
  return (
    <div className="flex my-2">
      <form onSubmit={onSubmit} className="m-auto w-full text-center">
        <StyledTextInput
          placeholder={placeHolderText ?? "Enter a .stark name"}
        ></StyledTextInput>
        <input type="submit" className="hidden" />
      </form>
    </div>
  );
};
