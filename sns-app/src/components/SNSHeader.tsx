import Link from "next/link";

const SNSHeader = () => {
    return (
        <div className="flex p-8 pt-20 pb-8">
            <Link href="/">
                <div className="text-center text-6xl m-auto cursor-pointer" >
                    Starknet Name Service
                </div>
            </Link>
        </div>
    )
}

export default SNSHeader;