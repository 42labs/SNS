# Starknet Name Service (SNS)

# About

See this [overview](https://www.notion.so/Starknet-Name-Service-SNS-c206e058e8b44287b99a0c0e29910577) for more information about the motivation and design choices behind the project.

## How to Use SNS

You use the SNS-provided web application to register your domain [name](https://sunny-salamander-6f6c7e.netlify.app/).

The Registry is deployed at address `0x05ab97cc647943dd0354b7b9073ceed535c3fdc24cc8fbd072979a7897982503`, see it on Voyager [here](https://goerli.voyager.online/contract/0x05ab97cc647943dd0354b7b9073ceed535c3fdc24cc8fbd072979a7897982503). The SampleResolver is at address `0x071597a3a4a96d7ed00d4643cd44ea7123c00756ebe0ccc8694ea0a0db2a7635#writeContract`, which you can inspect on Voyager at [this link](https://goerli.voyager.online/contract/0x071597a3a4a96d7ed00d4643cd44ea7123c00756ebe0ccc8694ea0a0db2a7635#writeContract).

# Usage

## Interacting with the Contracts

The `contracts/registry/IRegistry.cairo` file contains the Interface spec (`IRegistry`) for the registry contract. To look up  will want to call the registry's `get_resolver` or `get_resolver_by_name` functions to retrieve the address of the resolver for that domain.

The resolver for a domain might then provide different data for the domains it resolves. To check if a resolver implements a given method, determine the hash for the method you are interested in and call the resolver's `supports_interface` function. A method's hash is the namehash of the primary getter function, without `func`, implicit args or the colon (see `contracts.name.library.hash_name` for a Cairo implementation and `tests.utils.hash_name` for the Python equivalent). The `supports_interface` function returns `TRUE` (1) if the function is supported, and `FALSE` (0) if not.

Currently, the following resolver methods are supported:
- `get_starknet_address(namehash : felt) -> (starknet_address : felt)` with hash `2820744738538176835336224571064374651047813236984662977660834172684259369636`. This method resolves a domain name to a Starknet address. Thus, to check if a given resolver provides starknet addresses for a domain, call `supports_interface(2820744738538176835336224571064374651047813236984662977660834172684259369636)`.

## Working With the Contracts

### Setup

It is recommended to use pyenv and virtualenvwrapper, see [this tutorial](https://alysivji.github.io/setting-up-pyenv-virtualenvwrapper.html). You can verify that you have activated the virtualenv by running `which python`.

Make sure you are using python `3.7.*`. You can verify your python version by running `python --version`. 

Once your virtualenv and Python version are set up, install the requirements with `pip install -r requirements.txt`.

Then you can use the [Starknet CLI tool](https://www.cairo-lang.org/docs/hello_starknet/intro.html#compile-the-contract) or [Nile](https://medium.com/coinmonks/starknet-tutorial-for-beginners-using-nile-6af9c2270c15) to compile and deploy the contracts.

### Testing

Simply run `pytest .` from the root directory to run the full test suite.

# Credits

Thanks to guiltygyoza and his MVP SNS [implementation](https://github.com/guiltygyoza/sns) for the impetus.

Thanks to [ENS](https://github.com/ensdomains/ens) for building a fantastic naming service on Ethereum.