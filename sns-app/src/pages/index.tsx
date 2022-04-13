import ActionButton from '../components/ActionButton'
import SNSHeader from '../components/SNSHeader'

const IndexPage = () => (
  <div>
    <SNSHeader />
    <div className="flex">
      <div className="text-center px-4 py-0 mx-auto mb-4 text-lg w-8/12">
        Starknet Name Service (SNS) is the name service for Starknet, similar to DNS for the internet and ENS for Ethereum.
        Currently in beta on testnet, launching soon!
        You can find more information <a href="notion.so">here</a>.
      </div>
    </div>

    <div className="flex my-8">
      <div className="text-center m-auto">
        What would you like to do?
      </div>
    </div>

    <div className="flex mx-auto">
      <div className="m-auto my-2">
        <ActionButton pagePath="/search" text="Search" />
        <ActionButton pagePath="/register" text="Register" />
        <ActionButton pagePath="/manage" text="Manage" />
      </div>
    </div>
  </div>
)

export default IndexPage
