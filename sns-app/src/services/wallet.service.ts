import { getStarknet } from "@argent/get-starknet"

export const isWalletConnected = (): boolean => !!getStarknet()?.isConnected

export const connectWallet = async () =>
    await getStarknet().enable({ showModal: true })

export const walletAddress = async (): Promise<string | undefined> => {
    try {
        const [address] = await getStarknet().enable()
        return address
    } catch { }
}

export const getExplorerBaseUrl = (): string | undefined => {
    if (networkId() === "mainnet-alpha") {
        return "https://voyager.online"
    } else if (networkId() === "goerli-alpha") {
        return "https://goerli.voyager.online"
    }
}

type Network = "mainnet-alpha" | "goerli-alpha" | "localhost"

export const networkId = (): Network | undefined => {
    try {
        const { baseUrl } = getStarknet().provider
        if (baseUrl.includes("alpha-mainnet.starknet.io")) {
            return "mainnet-alpha"
        } else if (baseUrl.includes("alpha4.starknet.io")) {
            return "goerli-alpha"
        } else if (baseUrl.match(/^https?:\/\/localhost.*/)) {
            return "localhost"
        }
    } catch { }
}