import os
import pytest
import pytest_asyncio

from starkware.starknet.testing.starknet import Starknet
from starkware.starkware_utils.error_handling import StarkException

from utils import hash_name, encode_name

# The path to the contract source code.
CONTRACT_FILE = os.path.join(os.path.dirname(__file__), "../contracts/registry.cairo")


@pytest_asyncio.fixture
async def contract():
    starknet = await Starknet.empty()
    contract = await starknet.deploy(
        source=CONTRACT_FILE,
    )

    return contract


@pytest.fixture
def registration_period():
    return 10


@pytest_asyncio.fixture
async def registered_contract(contract, name, address):

    encoded_name_array = encode_name(name)

    try:
        await contract.get_resolver_by_name(encoded_name_array).invoke()

        raise Exception(
            "Transaction to get resolver for unregistered name succeeded, but should not have."
        )
    except StarkException:
        pass

    await contract.register(encoded_name_array, address, address, 10).invoke()

    return contract


@pytest.mark.asyncio
async def test_deploy(contract):
    return


@pytest.mark.asyncio
async def test_register(registered_contract, name, address):

    encoded_name_array = encode_name(name)

    result = await registered_contract.get_record_by_name(encoded_name_array).invoke()

    assert address == result.result.record.resolver_addr
    assert address == result.result.record.owner_addr

    return


@pytest.mark.asyncio
async def test_register_subdomains(
    registered_contract, name, address, subdomain, registration_period
):
    encoded_parent_name_array = encode_name(name)
    encoded_subdomain_name_array = encode_name(subdomain)
    encoded_name_array = encoded_subdomain_name_array + encoded_parent_name_array

    parent_namehash = hash_name(name)

    try:
        await registered_contract.get_record_by_name(encoded_name_array).invoke()

        raise Exception(
            "Transaction to get record for unregistered subdomain succeeded, but should not have."
        )
    except StarkException:
        pass

    try:
        await registered_contract.register(
            encoded_name_array, address, address, registration_period
        ).invoke()

        raise Exception(
            "Transaction to register subdomain as new domain succeeded, but should not have."
        )
    except StarkException:
        pass

    await registered_contract.register_subdomain_with_name(
        encoded_subdomain_name_array,
        encoded_parent_name_array,
        address + 2,
        address + 2,
    ).invoke(caller_address=address)

    result = await registered_contract.get_record_by_name(encoded_name_array).invoke()
    assert address + 2 == result.result.record.resolver_addr
    assert address + 2 == result.result.record.owner_addr
    assert parent_namehash == result.result.record.apex_namehash

    return


@pytest.mark.asyncio
async def test_re_register_expired_address(
    contract, name, address, registration_period
):

    encoded_name_array = encode_name(name)

    await contract.register(encoded_name_array, address, address, 0).invoke()

    await contract.register(
        encoded_name_array, address + 1, address, registration_period
    ).invoke()

    result = await contract.get_record_by_name(encoded_name_array).invoke()
    assert address + 1 == result.result.record.owner_addr

    return


@pytest.mark.asyncio
async def test_register_fail_already_registered(
    registered_contract, name, address, registration_period
):

    encoded_name_array = encode_name(name)

    try:
        await registered_contract.register(
            encoded_name_array, address + 1, address, registration_period
        ).invoke()

        raise Exception(
            "Transaction to re-register with already registered address did not fail."
        )
    except StarkException:
        pass

    return


@pytest.mark.asyncio
async def test_register_fail_registration_period_too_large(contract, name, address):

    encoded_name_array = encode_name(name)

    try:
        await contract.register(encoded_name_array, address, address, 100).invoke()

        raise Exception(
            "Transaction to re-register with already registered address did not fail."
        )
    except StarkException:
        pass

    return


@pytest.mark.asyncio
async def test_register_fail_wrong_tld(contract, address, registration_period):
    name = "foo.com"
    encoded_name_array = encode_name(name)
    try:
        await contract.register(
            encoded_name_array, address, address, registration_period
        ).invoke()

        raise Exception("Transaction to register with wrong TLD did not fail.")
    except StarkException:
        pass

    return


@pytest.mark.asyncio
async def test_hash_name(registered_contract, name):
    encoded_name_array = encode_name(name)
    namehash = hash_name(name)

    result = await registered_contract.get_namehash(encoded_name_array).invoke()
    assert namehash == result.result.namehash

    return


@pytest.mark.asyncio
async def test_assert_owner(registered_contract, name, address):
    namehash = hash_name(name)

    await registered_contract.assert_owner(namehash, address).invoke()

    try:
        await registered_contract.assert_owner(namehash, address + 1).invoke()

        raise Exception(
            "Transaction to get resolver for unregistered name succeeded, but should not have."
        )
    except StarkException:
        pass

    return


@pytest.mark.asyncio
async def test_assert_owner_by_name(registered_contract, name, address):
    encoded_name_array = encode_name(name)

    await registered_contract.assert_owner_by_name(encoded_name_array, address).invoke()

    try:
        await registered_contract.assert_owner_by_name(
            encoded_name_array, address + 1
        ).invoke()

        raise Exception(
            "Transaction to get resolver for unregistered name succeeded, but should not have."
        )
    except StarkException:
        pass

    return


@pytest.mark.asyncio
async def test_transfer_ownership(registered_contract, name, address):
    encoded_name_array = encode_name(name)

    await registered_contract.transfer_ownership(
        encoded_name_array, address + 1
    ).invoke(caller_address=address)

    await registered_contract.assert_owner_by_name(
        encoded_name_array, address + 1
    ).invoke()

    try:
        await registered_contract.assert_owner_by_name(
            encoded_name_array, address
        ).invoke()

        raise Exception(
            "Transaction to get resolver for unregistered name succeeded, but should not have."
        )
    except StarkException:
        pass

    return


@pytest.mark.asyncio
async def test_update_resolver(registered_contract, name, address):
    encoded_name_array = encode_name(name)

    await registered_contract.update_resolver(encoded_name_array, address + 1).invoke(
        caller_address=address
    )

    result = await registered_contract.get_resolver_by_name(encoded_name_array).invoke()
    assert address + 1 == result.result.resolver_addr

    return
