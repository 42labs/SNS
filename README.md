# Starknet Naming Service (SNS)

# About

See this [overview](https://rocky-volleyball-654.notion.site/Starknet-Naming-Service-RFQ-c206e058e8b44287b99a0c0e29910577) for more information about the motivation and design choices behind the project.

## How to Use SNS

Once the contracts are deployed, this section will be updated with instructions and addresses.

# Usage

## Interacting with the Contracts

The `contracts/registry_interface.cairo` file contains the Interface spec (`IRegistryContract`) for the registry contract. In order to retrieve a Starknet address for a given name, you need two calls:
1. Call the registry's `get_resolver` or `get_resolver_by_name` functions to retrieve the address of the resolver for that domain.
2. For that Resolver, call `get_starknet_address` or `get_starknet_address_by_name` functions to retrieve the Starknet address for the name.

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