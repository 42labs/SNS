%lang starknet

from starkware.starknet.common.syscalls import get_caller_address
from starkware.cairo.common.cairo_builtins import HashBuiltin

from utils.name import hash_name
from contracts.registry_interface import IRegistryContract

const STARKNET_ADDRESS_INTERFACE_HASH = 0x0  # TODO

@external
func assert_supports_interface(interface_hash : felt):
    with_attr error_message("Interface not supported"):
        assert interface_hash = STARKNET_ADDRESS_INTERFACE_HASH
    end
    return ()
end

# Resolve .stark addresses
@storage_var
func starknet_address_storage(namehash : felt) -> (starknet_address : felt):
end

@storage_var
func registry_address_storage() -> (registry_address : felt):
end

@constructor
func constructor{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        registry_address : felt):
    registry_address_storage.write(value=registry_address)
    return ()
end

@view
func get_registry_address{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (
        registry_address : felt):
    let (registry_address) = registry_address_storage.read()
    return (registry_address)
end

@view
func get_starknet_address{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        namehash : felt) -> (starknet_address : felt):
    let (starknet_address) = starknet_address_storage.read(namehash)
    return (starknet_address)
end

@view
func get_starknet_address_by_name{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*) -> (starknet_address : felt):
    let (namehash) = hash_name(name_len, name)

    let (starknet_address) = get_starknet_address(namehash)
    return (starknet_address)
end

@external
func set_starknet_address{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        namehash, starknet_address):
    # Call registry and ensure that the calling address is allowed to set this name
    let (caller_addess) = get_caller_address()

    let (registry_address) = registry_address_storage.read()

    IRegistryContract.assert_owner(
        contract_address=registry_address, namehash=namehash, address=caller_addess)

    starknet_address_storage.write(namehash, starknet_address)

    return ()
end

@external
func set_starknet_address_by_name{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*, starknet_address):
    let (namehash) = hash_name(name_len, name)

    set_starknet_address(namehash, starknet_address)

    return ()
end
