import classNames from "classnames";
import React, { useState } from "react";
import { FormEvent } from "react";

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
      props.className,
      "placeholder-purple-500 py-2 px-4 my-4 rounded-lg text-lg w-5/12 max-w-4xl min-w-fit"
    )}
  ></input>
);

interface NameInputProps {
  onInputSubmit: (name: string) => void;
  placeHolderText?: string;
}

export const NameInput = ({
  onInputSubmit,
  placeHolderText,
}: NameInputProps) => {
  const [errorMessage, setErrorMessage] = useState<string>();
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = event.target[0].value;
    if (text.slice(-6) !== ".stark") {
      setErrorMessage("Name must end in '.stark'");
    } else if (text.split(".").length > 2) {
      // Should only have one "." in it, i.e. no subdomains
      setErrorMessage("Subdomains are currently not supported");
    } else {
      setErrorMessage(undefined);
      onInputSubmit(text);
      event.target[0].value = "";
      event.target[0].blur();
    }
  };
  return (
    <div className="flex my-2">
      <form onSubmit={onSubmit} className="m-auto w-full text-center">
        {errorMessage && (
          <div className="text-red-800">{"❌ " + " " + errorMessage}</div>
        )}
        <StyledTextInput
          placeholder={placeHolderText ?? "Enter a .stark name"}
          className={classNames({ "my-2": errorMessage !== undefined })}
        ></StyledTextInput>
        <input type="submit" className="hidden" />
      </form>
    </div>
  );
};

interface NameInputWithPromptProps extends NameInputProps {
  prompt: string;
}

export const NameInputWithPrompt = (props: NameInputWithPromptProps) => (
  <div className="mb-12">
    <div className="mt-8 text-xl text-center">{props.prompt}</div>
    <NameInput {...props} />
  </div>
);
