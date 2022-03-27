import os
import pytest
import pytest_asyncio

from starkware.starknet.testing.starknet import Starknet
from starkware.starkware_utils.error_handling import StarkException

from utils import str_to_felt

# The path to the contract source code.
REGISTRY_CONTRACT_FILE = os.path.join(
    os.path.dirname(__file__), "../contracts/registry.cairo")

RESOLVER_CONTRACT_FILE = os.path.join(
    os.path.dirname(__file__), "../contracts/sample_resolver.cairo")

@pytest.fixture
def encoded_name_array():
    name = "foo.stark"
    return [str_to_felt(c) for c in list(name)]

@pytest.fixture
def address():
    return 3139084549856436378687393015680186785185683929880547773483526600592946091349

@pytest.fixture
def namehash():
    return 2620136408426268427374264734671367866746320738357084942770757565003311849299

@pytest_asyncio.fixture
async def contracts():
    starknet = await Starknet.empty()
    registry_contract = await starknet.deploy(
        source=REGISTRY_CONTRACT_FILE
    )
    resolver_contract = await starknet.deploy(
        source=RESOLVER_CONTRACT_FILE, constructor_calldata=[registry_contract.contract_address]
    )

    return registry_contract, resolver_contract

@pytest_asyncio.fixture
async def registered_and_resolver_contracts(contracts, encoded_name_array, address):
    registry_contract, resolver_contract = contracts

    await registry_contract.register(encoded_name_array, address, resolver_contract.contract_address, 10).invoke()

    await resolver_contract.set_starknet_address_by_name(encoded_name_array, address).invoke(caller_address=address)

    return registry_contract, resolver_contract

@pytest.mark.asyncio
async def test_deploy(contracts):
    registry_contract, resolver_contract = contracts

    result = await resolver_contract.get_registry_address().invoke()
    assert registry_contract.contract_address == result.result.registry_address

    return

@pytest.mark.asyncio
async def test_register_and_add_resolver(registered_and_resolver_contracts, encoded_name_array, address):
    _, resolver_contract = registered_and_resolver_contracts

    result = await resolver_contract.get_starknet_address_by_name(encoded_name_array).invoke()
    assert address == result.result.starknet_address
    
    return

@pytest.mark.asyncio
async def test_resolver_for_unknown_name(registered_and_resolver_contracts, namehash, address):
    _, resolver_contract = registered_and_resolver_contracts

    result = await resolver_contract.get_starknet_address(namehash).invoke()
    assert address == result.result.starknet_address

    result = await resolver_contract.get_starknet_address(namehash+1).invoke()
    assert 0 == result.result.starknet_address
    
    return

@pytest.mark.asyncio
async def test_only_owner_can_update_resolver(registered_and_resolver_contracts, encoded_name_array, address):
    _, resolver_contract = registered_and_resolver_contracts

    try:
        await resolver_contract.set_starknet_address_by_name(encoded_name_array, address).invoke(caller_address=address+1)
        
        raise Exception("Transaction to get resolver for unregistered name succeeded, but should not have.")
    except StarkException as e:
        pass
    
    return