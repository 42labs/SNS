import os
import pytest
import pytest_asyncio

from starkware.starknet.testing.starknet import Starknet
from starkware.starkware_utils.error_handling import StarkException
from starkware.cairo.lang.vm.vm_exceptions import VmException

from utils import str_to_felt

# The path to the contract source code.
CONTRACT_FILE = os.path.join(
    os.path.dirname(__file__), "../contracts/registry.cairo")

@pytest_asyncio.fixture
async def contract():
    # Create a new Starknet class that simulates the StarkNet
    # system.
    starknet = await Starknet.empty()

    # Deploy the contract.
    contract = await starknet.deploy(
        source=CONTRACT_FILE,
    )

    return contract

@pytest.fixture
def address():
    return 3139084549856436378687393015680186785185683929880547773483526600592946091349


@pytest.mark.asyncio
async def test_deploy(contract):
    return


@pytest.mark.asyncio
async def test_register(contract, address):
    name = "foo.stark"
    encoded_name_array = [str_to_felt(c) for c in list(name)]

    try:
        await contract.get_resolver_by_name(encoded_name_array).invoke()

        raise Exception("Transaction to get resolver for unregistered name succeeded, but should not have.")
    except StarkException as e:
        pass

    await contract.register(encoded_name_array, address, address, 10).invoke()

    result = await contract.get_resolver_by_name(encoded_name_array).invoke()
    assert address == result.result.resolver_addr

    return


@pytest.mark.asyncio
async def test_register_fail_wrong_tld(contract, address):
    name = "foo.com"
    encoded_name_array = [str_to_felt(c) for c in list(name)]
    try:
        await contract.register(encoded_name_array, address, address, 10).invoke()

        raise Exception("Transaction to register with wrong TLD did not fail.")
    except StarkException as e:
        pass

    return
