%lang starknet

from starkware.cairo.common.cairo_builtins import HashBuiltin

from contracts.registry.library import (
    Registry_Record, Registry_get_record, Registry_get_record_by_name, Registry_get_resolver,
    Registry_get_resolver_by_name, Registry_get_namehash, Registry_register,
    Registry_register_subdomain, Registry_register_subdomain_with_name, Registry_transfer_ownership,
    Registry_update_resolver, Registry_assert_owner, Registry_assert_owner_by_name)

#
# Guards
#

@view
func assert_owner{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        namehash : felt, address : felt):
    Registry_assert_owner(namehash, address)
    return ()
end

@view
func assert_owner_by_name{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*, address : felt):
    Registry_assert_owner_by_name(name_len, name, address)
    return ()
end

#
# Getters
#

@view
func get_record{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        namehash : felt) -> (record : Registry_Record):
    let (record) = Registry_get_record(namehash)
    return (record)
end

@view
func get_record_by_name{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*) -> (record : Registry_Record):
    let (record) = Registry_get_record_by_name(name_len, name)
    return (record)
end

@view
func get_resolver{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        namehash : felt) -> (resolver_addr : felt):
    let (resolver_addr) = Registry_get_resolver(namehash)
    return (resolver_addr)
end

@view
func get_resolver_by_name{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*) -> (resolver_addr : felt):
    let (resolver_addr) = Registry_get_resolver_by_name(name_len, name)
    return (resolver_addr)
end

@view
func get_namehash{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*) -> (namehash : felt):
    let (namehash) = Registry_get_namehash(name_len, name)
    return (namehash)
end

#
# Setters
#

@external
func register{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*, owner_addr : felt, resolver_addr : felt,
        registration_years : felt):
    Registry_register(name_len, name, owner_addr, resolver_addr, registration_years)
    return ()
end

@external
func register_subdomain{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        label_len : felt, label : felt*, parent_namehash : felt, owner_addr : felt,
        resolver_addr : felt):
    Registry_register_subdomain(label_len, label, parent_namehash, owner_addr, resolver_addr)
    return ()
end

@external
func register_subdomain_with_name{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        label_len : felt, label : felt*, parent_name_len : felt, parent_name : felt*,
        owner_addr : felt, resolver_addr : felt):
    Registry_register_subdomain_with_name(
        label_len, label, parent_name_len, parent_name, owner_addr, resolver_addr)
    return ()
end

@external
func transfer_ownership{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*, new_owner_addr : felt):
    Registry_transfer_ownership(name_len, name, new_owner_addr)
    return ()
end

@external
func update_resolver{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*, new_resolver_addr : felt):
    Registry_update_resolver(name_len, name, new_resolver_addr)
    return ()
end
