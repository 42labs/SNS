import { useRouter } from "next/router";
import { useState } from "react";
import NameInput from "../components/NameInput";
import SNSHeader from "../components/SNSHeader";

const SearchPage = () => {
    const [address, setAddress] = useState("")
    const router = useRouter()

    const handleNameInputSubmit = (name: string) => {
        router.push('search/?name=' + encodeURI(name))
        getAndSetAddress(name)
    }
    const { name } = router.query

    const getAndSetAddress = (name: string) => {
        const address = name
        setAddress(address)
    }

    return (<div>
        <SNSHeader />
        {name == undefined ?
            (
                <div>
                    <div className="text-center mx-auto">
                        Enter a name below to find out who owns it
                    </div>
                </div>
            )
            :
            (
                <div>
                    <div className="text-center mx-auto text-lg my-8">
                        <div className="font-semibold inline">{name}</div> belongs to address {address}
                    </div>

                </div>
            )
        }
        <NameInput handleInputSubmit={handleNameInputSubmit} placeHolderText={name == undefined ? "Enter a .stark name" : "Search another name"} />
    </div>
    )
}

export default SearchPage;