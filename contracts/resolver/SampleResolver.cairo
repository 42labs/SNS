%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin

from contracts.resolver.library import (
    Resolver_registry_address_storage, Resolver_assert_supports_interface,
    Resolver_get_registry_address, Resolver_get_starknet_address,
    Resolver_get_starknet_address_by_name, Resolver_set_starknet_address,
    Resolver_set_starknet_address_by_name)

#
# Constructor
#

@constructor
func constructor{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        registry_address : felt):
    Resolver_registry_address_storage.write(value=registry_address)
    return ()
end

#
# Guards
#

@view
func assert_supports_interface(interface_hash : felt):
    Resolver_assert_supports_interface(interface_hash)
    return ()
end

#
# Getters
#

@view
func get_registry_address{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}() -> (
        registry_address : felt):
    let (registry_address) = Resolver_get_registry_address()
    return (registry_address)
end

@view
func get_starknet_address{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        namehash : felt) -> (starknet_address : felt):
    let (starknet_address) = Resolver_get_starknet_address(namehash)
    return (starknet_address)
end

@view
func get_starknet_address_by_name{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*) -> (starknet_address : felt):
    let (starknet_address) = Resolver_get_starknet_address_by_name(name_len, name)
    return (starknet_address)
end

#
# Setters
#

@external
func set_starknet_address{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        namehash, starknet_address):
    Resolver_set_starknet_address(namehash, starknet_address)
    return ()
end

@external
func set_starknet_address_by_name{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*, starknet_address):
    Resolver_set_starknet_address_by_name(name_len, name, starknet_address)
    return ()
end
