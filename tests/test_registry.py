import os
import pytest
import pytest_asyncio

from starkware.starknet.testing.starknet import Starknet
from starkware.starkware_utils.error_handling import StarkException

from utils import str_to_felt

# The path to the contract source code.
CONTRACT_FILE = os.path.join(
    os.path.dirname(__file__), "../contracts/registry.cairo")

@pytest.fixture
def encoded_name_array():
    name = "foo.stark"
    return [str_to_felt(c) for c in list(name)]

@pytest.fixture
def namehash():
    return 2620136408426268427374264734671367866746320738357084942770757565003311849299

@pytest_asyncio.fixture
async def contract():
    starknet = await Starknet.empty()
    contract = await starknet.deploy(
        source=CONTRACT_FILE,
    )

    return contract

@pytest.fixture
def address():
    return 3139084549856436378687393015680186785185683929880547773483526600592946091349

@pytest_asyncio.fixture
async def registered_contract(contract, encoded_name_array, address):

    try:
        await contract.get_resolver_by_name(encoded_name_array).invoke()

        raise Exception("Transaction to get resolver for unregistered name succeeded, but should not have.")
    except StarkException as e:
        pass

    await contract.register(encoded_name_array, address, address, 10).invoke()

    return contract


@pytest.mark.asyncio
async def test_deploy(contract):
    return


@pytest.mark.asyncio
async def test_register(registered_contract, encoded_name_array, address):

    result = await registered_contract.get_resolver_by_name(encoded_name_array).invoke()
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

@pytest.mark.asyncio
async def test_hash_name(registered_contract, encoded_name_array, namehash):
    result = await registered_contract.get_namehash(encoded_name_array).invoke()
    assert namehash == result.result.namehash

    return

@pytest.mark.asyncio
async def test_assert_owner(registered_contract, namehash, address):

    await registered_contract.assert_owner(namehash, address).invoke()

    try:
        await registered_contract.assert_owner(namehash, address+1).invoke()

        raise Exception("Transaction to get resolver for unregistered name succeeded, but should not have.")
    except StarkException as e:
        pass

    return

@pytest.mark.asyncio
async def test_assert_owner_by_name(registered_contract, encoded_name_array, address):

    await registered_contract.assert_owner_by_name(encoded_name_array, address).invoke()

    try:
        await registered_contract.assert_owner_by_name(encoded_name_array, address+1).invoke()

        raise Exception("Transaction to get resolver for unregistered name succeeded, but should not have.")
    except StarkException as e:
        pass

    return

@pytest.mark.asyncio
async def test_transfer_ownership(registered_contract, encoded_name_array, address):

    await registered_contract.transfer_ownership(encoded_name_array, address+1).invoke(caller_address=address)

    await registered_contract.assert_owner_by_name(encoded_name_array, address+1).invoke()

    try:
        await registered_contract.assert_owner_by_name(encoded_name_array, address).invoke()

        raise Exception("Transaction to get resolver for unregistered name succeeded, but should not have.")
    except StarkException as e:
        pass

    return

@pytest.mark.asyncio
async def test_update_resolver(registered_contract, encoded_name_array, address):

    await registered_contract.update_resolver(encoded_name_array, address+1).invoke(caller_address=address)

    result = await registered_contract.get_resolver_by_name(encoded_name_array).invoke()
    assert address+1 == result.result.resolver_addr

    return