%lang starknet

from starkware.starknet.common.syscalls import get_caller_address
from starkware.cairo.common.cairo_builtins import HashBuiltin

from utils.constants import TRUE, FALSE
from utils.string import String
from utils.name import hash_name
from contracts.registry_interface import IRegistryContract

const STARKNET_ADDRESS_INTERFACE_HASH = 0x0  # TODO
const REGISTRY_CONTRACT_ADDRESS = 0x0  # TODO

@external
func supports_interface(interface_hash : felt) -> (res : felt):
    if interface_hash == STARKNET_ADDRESS_INTERFACE_HASH:
        return (TRUE)
    end
    return (FALSE)
end

# Resolve .stark addresses
@storage_var
func starknet_address(namehash : felt) -> (res : felt):
end

@view
func get_starknet_address{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        namehash : felt) -> (res : felt):
    let (res) = starknet_address.read(namehash)
    return (res)
end

@view
func get_starknet_address_by_name{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*) -> (res : felt):
    let name_str = String(start=name, len=name_len)
    let (namehash) = hash_name(name_str)

    let (res) = get_starknet_address(namehash)
    return (res)
end

@external
func set_starknet_address{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        namehash, address):
    # Call registry and ensure that the calling address is allowed to set this name
    let (caller_addess) = get_caller_address()

    IRegistryContract.assert_owner(
        contract_address=REGISTRY_CONTRACT_ADDRESS, namehash=namehash, address=caller_addess)

    starknet_address.write(namehash, address)

    return ()
end

@external
func set_starknet_address_by_name{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*, address):
    # Call registry and ensure that the calling address is allowed to set this name
    let name_str = String(start=name, len=name_len)
    let (namehash) = hash_name(name_str)

    set_starknet_address(namehash, address)

    return ()
end
