%lang starknet

from starkware.starknet.common.syscalls import get_caller_address
from starkware.cairo.common.cairo_builtins import HashBuiltin

from contracts.name.library import hash_name
from contracts.registry.IRegistry import IRegistry

#
# Const
#

const STARKNET_ADDRESS_INTERFACE_HASH = 0x0  # TODO

#
# Struct
#

#
# Storage
#

# Resolve .stark addresses
@storage_var
func Resolver_starknet_address_storage(namehash : felt) -> (starknet_address : felt):
end

@storage_var
func Resolver_registry_address_storage() -> (registry_address : felt):
end

#
# Guards
#

func Resolver_assert_supports_interface(interface_hash : felt):
    with_attr error_message("Interface not supported"):
        assert interface_hash = STARKNET_ADDRESS_INTERFACE_HASH
    end
    return ()
end

#
# Initializer
#

func Resolver_initialize_registry{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(registry_address : felt):
    Resolver_registry_address_storage.write(value=registry_address)
    return ()
end

#
# Getters
#

func Resolver_get_registry_address{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (
        registry_address : felt):
    let (registry_address) = Resolver_registry_address_storage.read()
    return (registry_address)
end

func Resolver_get_starknet_address{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(namehash : felt) -> (
        starknet_address : felt):
    let (starknet_address) = Resolver_starknet_address_storage.read(namehash)
    return (starknet_address)
end

func Resolver_get_starknet_address_by_name{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*) -> (starknet_address : felt):
    let (namehash) = hash_name(name_len, name)

    let (starknet_address) = Resolver_get_starknet_address(namehash)
    return (starknet_address)
end

#
# Setters
#

func Resolver_set_starknet_address{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        namehash, starknet_address):
    # Call registry and ensure that the calling address is allowed to set this name
    let (caller_addess) = get_caller_address()
    let (registry_address) = Resolver_registry_address_storage.read()
    IRegistry.assert_owner(
        contract_address=registry_address, namehash=namehash, address=caller_addess)

    Resolver_starknet_address_storage.write(namehash, starknet_address)

    return ()
end

func Resolver_set_starknet_address_by_name{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*, starknet_address):
    let (namehash) = hash_name(name_len, name)
    Resolver_set_starknet_address(namehash, starknet_address)

    return ()
end
