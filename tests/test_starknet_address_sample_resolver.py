import os
import pytest
import pytest_asyncio

from starkware.starknet.testing.starknet import Starknet
from starkware.starkware_utils.error_handling import StarkException

from utils import encode_name, hash_name

# The path to the contract source code.
REGISTRY_CONTRACT_FILE = os.path.join(
    os.path.dirname(__file__), "../contracts/registry/Registry.cairo"
)

RESOLVER_CONTRACT_FILE = os.path.join(
    os.path.dirname(__file__),
    "../contracts/starknet-address-resolver/SampleResolver.cairo",
)


@pytest_asyncio.fixture
async def contracts():
    starknet = await Starknet.empty()
    registry_contract = await starknet.deploy(source=REGISTRY_CONTRACT_FILE)
    resolver_contract = await starknet.deploy(
        source=RESOLVER_CONTRACT_FILE,
        constructor_calldata=[registry_contract.contract_address],
    )

    return registry_contract, resolver_contract


@pytest_asyncio.fixture
async def registered_and_resolver_contracts(contracts, name, address):
    encoded_name_array = encode_name(name)
    registry_contract, resolver_contract = contracts

    await registry_contract.register(
        encoded_name_array, address, resolver_contract.contract_address, 10
    ).invoke()

    await resolver_contract.set_starknet_address_by_name(
        encoded_name_array, address
    ).invoke(caller_address=address)

    return registry_contract, resolver_contract


@pytest.mark.asyncio
async def test_deploy(contracts):
    registry_contract, resolver_contract = contracts

    result = await resolver_contract.get_registry_address().invoke()
    assert registry_contract.contract_address == result.result.registry_address

    return


@pytest.mark.asyncio
async def test_register_and_add_resolver(
    registered_and_resolver_contracts, name, address
):
    encoded_name_array = encode_name(name)
    _, resolver_contract = registered_and_resolver_contracts

    result = await resolver_contract.get_starknet_address_by_name(
        encoded_name_array
    ).invoke()
    assert address == result.result.starknet_address

    return


@pytest.mark.asyncio
async def test_resolver_for_unknown_name(
    registered_and_resolver_contracts, name, address
):
    namehash = hash_name(name)
    _, resolver_contract = registered_and_resolver_contracts

    result = await resolver_contract.get_starknet_address(namehash).invoke()
    assert address == result.result.starknet_address

    result = await resolver_contract.get_starknet_address(namehash + 1).invoke()
    assert 0 == result.result.starknet_address

    return


@pytest.mark.asyncio
async def test_only_owner_can_update_resolver(
    registered_and_resolver_contracts, name, address
):
    encoded_name_array = encode_name(name)
    _, resolver_contract = registered_and_resolver_contracts

    try:
        await resolver_contract.set_starknet_address_by_name(
            encoded_name_array, address
        ).invoke(caller_address=address + 1)

        raise Exception(
            "Transaction to get resolver for unregistered name succeeded, but should not have."
        )
    except StarkException:
        pass

    return


@pytest.mark.asyncio
async def test_register_and_add_resolver_subdomain(
    registered_and_resolver_contracts, name, label, address
):
    encoded_name_array = encode_name(name)
    encoded_label_array = encode_name(label)
    encoded_subdomain_array = encoded_label_array + encoded_name_array
    registry_contract, resolver_contract = registered_and_resolver_contracts

    await registry_contract.register_subdomain_with_name(
        encoded_label_array,
        encoded_name_array,
        address + 1,
        resolver_contract.contract_address,
    ).invoke(caller_address=address)

    await resolver_contract.set_starknet_address_by_name(
        encoded_subdomain_array, address + 2
    ).invoke(caller_address=address + 1)

    result = await resolver_contract.get_starknet_address_by_name(
        encoded_subdomain_array
    ).invoke()
    assert address + 2 == result.result.starknet_address

    await registry_contract.assert_owner_by_name(
        encoded_subdomain_array, address + 1
    ).invoke()

    return
