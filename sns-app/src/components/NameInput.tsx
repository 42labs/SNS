import { FormEvent } from "react";

interface NameInputProps {
    handleInputSubmit: (text: string) => void;
    placeHolderText: string;
}

const NameInput = ({ handleInputSubmit, placeHolderText }: NameInputProps) => {
    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const text = event.target[0].value
        handleInputSubmit(text)
        event.target[0].value = ""
        event.target[0].blur()
    }
    return (
        <div className="flex my-6">
            <form onSubmit={onSubmit} className="m-auto">
                <input type="text" placeholder={placeHolderText} className="placeholder-purple-500 py-2 px-4 rounded-lg text-lg"></input>
                <input type="submit" className="hidden" />
            </form>
        </div>
    )
}

export default NameInput;