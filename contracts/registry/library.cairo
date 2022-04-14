%lang starknet

from starkware.starknet.common.syscalls import get_caller_address, get_block_timestamp
from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.math import assert_nn_le, assert_not_equal

from contracts.name.library import (
    hash_name, hash_name_with_base, assert_name_is_label_dotstark, assert_name_is_label_dot)

#
# Const
#

const MAX_REGISTRATION_YEARS = 10
const SECONDS_IN_YEAR = 31556926

#
# Struct
#

struct Registry_Record:
    member owner_addr : felt
    member resolver_addr : felt
    member apex_namehash : felt  # namehash of the apex domain, e.g. 'foo.stark' for 'bar.foo.stark'
    member exist : felt
end

#
# Storage
#

@storage_var
func Registry_record_storage(namehash : felt) -> (record : Registry_Record):
end

@storage_var
func Registry_expiration_storage(namehash : felt) -> (expiration_timestamp : felt):
end

#
# Guards
#

func Registry_assert_registration_is_not_expired{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(namehash : felt):
    alloc_locals

    let (local current_timestamp) = get_block_timestamp()
    let (record) = Registry_record_storage.read(namehash)
    if record.exist == 0:
        return ()
    end
    let (expiration_timestamp) = Registry_expiration_storage.read(record.apex_namehash)

    with_attr error_message("Record is expired"):
        assert_nn_le(current_timestamp, expiration_timestamp)
    end

    return ()
end

func Registry_assert_caller_is_owner{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(namehash : felt):
    let (caller_addess) = get_caller_address()
    Registry_assert_owner(namehash, caller_addess)
    return ()
end

func Registry_assert_record_exists{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(namehash : felt):
    let (record) = Registry_record_storage.read(namehash)

    with_attr error_message("Record does not exist"):
        assert record.exist = 1
    end

    return ()
end

func Registry_assert_record_does_not_exist{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(namehash : felt):
    let (record) = Registry_record_storage.read(namehash)
    with_attr error_message("Record already exists"):
        assert record.apex_namehash = 0
    end
    return ()
end

func Registry_assert_owner{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        namehash : felt, address : felt):
    alloc_locals

    let (local res) = Registry_get_record(namehash)

    Registry_assert_record_exists(namehash)
    Registry_assert_registration_is_not_expired(namehash)

    with_attr error_message("Insufficient permission (not owner)"):
        assert res.owner_addr = address
    end

    return ()
end

func Registry_assert_owner_by_name{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*, address : felt):
    alloc_locals

    local range_check_ptr = range_check_ptr

    let (namehash) = hash_name(name_len, name)
    Registry_assert_owner(namehash, address)
    return ()
end

#
# Getters
#

func Registry_get_record{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        namehash : felt) -> (record : Registry_Record):
    alloc_locals

    let (local res) = Registry_record_storage.read(namehash)

    Registry_assert_registration_is_not_expired(res.apex_namehash)

    return (res)
end

func Registry_get_record_by_name{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*) -> (record : Registry_Record):
    alloc_locals

    local range_check_ptr = range_check_ptr

    let (namehash) = hash_name(name_len, name)
    let (res) = Registry_get_record(namehash)

    return (res)
end

func Registry_get_resolver{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        namehash : felt) -> (resolver_addr : felt):
    let (res) = Registry_get_record(namehash)

    return (res.resolver_addr)
end

func Registry_get_resolver_by_name{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*) -> (resolver_addr : felt):
    alloc_locals

    local range_check_ptr = range_check_ptr

    let (namehash) = hash_name(name_len, name)
    let (resolver_addr) = Registry_get_resolver(namehash)

    return (resolver_addr)
end

func Registry_get_namehash{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*) -> (namehash : felt):
    let (namehash) = hash_name(name_len, name)

    return (namehash)
end

#
# Setters
#

func Registry_register{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*, owner_addr : felt, resolver_addr : felt,
        registration_years : felt):
    alloc_locals

    local range_check_ptr = range_check_ptr

    # Validate inputs
    assert_name_is_label_dotstark(name_len, name)
    assert_nn_le(registration_years, MAX_REGISTRATION_YEARS)

    let (namehash) = hash_name(name_len, name)

    let (res) = Registry_record_storage.read(namehash)
    let (expiration_timestamp) = Registry_expiration_storage.read(namehash)
    let (caller_address) = get_caller_address()
    let (current_timestamp) = get_block_timestamp()

    # Create new entry if entry does not exist (all values on the struct will be 0)
    # or if the registration is expired
    with_attr error_message("Domain already registered, and not expired yet"):
        assert_nn_le(expiration_timestamp, current_timestamp)
    end

    let expiration_timestamp = current_timestamp + registration_years * SECONDS_IN_YEAR
    Registry_expiration_storage.write(namehash, expiration_timestamp)
    let new_res = Registry_Record(
        owner_addr=owner_addr, resolver_addr=resolver_addr, apex_namehash=namehash, exist=1)
    Registry_record_storage.write(namehash, new_res)

    return ()
end

func Registry_register_subdomain{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        label_len : felt, label : felt*, parent_namehash : felt, owner_addr : felt,
        resolver_addr : felt):
    alloc_locals

    local range_check_ptr = range_check_ptr

    let (subdomain_namehash) = hash_name_with_base(label_len, label, parent_namehash)

    # Validate label
    assert_name_is_label_dot(label_len, label)
    Registry_assert_record_does_not_exist(subdomain_namehash)

    # Validate caller
    let (parent_record) = Registry_record_storage.read(parent_namehash)
    Registry_assert_record_exists(parent_namehash)
    Registry_assert_registration_is_not_expired(parent_namehash)
    Registry_assert_caller_is_owner(parent_namehash)
    let (expiration_timestamp) = Registry_expiration_storage.read(parent_record.apex_namehash)
    let (subdomain_record) = Registry_record_storage.read(subdomain_namehash)

    # Create new entry if entry does not exist
    with_attr error_message("Subdomain already registered, please use update function"):
        assert_nn_le(0, subdomain_record.apex_namehash)
    end

    let new_res = Registry_Record(
        owner_addr=owner_addr,
        resolver_addr=resolver_addr,
        apex_namehash=parent_record.apex_namehash,
        exist=1)
    Registry_record_storage.write(subdomain_namehash, new_res)

    return ()
end

func Registry_register_subdomain_with_name{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        label_len : felt, label : felt*, parent_name_len : felt, parent_name : felt*,
        owner_addr : felt, resolver_addr : felt):
    let (parent_namehash) = hash_name(parent_name_len, parent_name)
    Registry_register_subdomain(label_len, label, parent_namehash, owner_addr, resolver_addr)

    return ()
end

func Registry_transfer_ownership{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*, new_owner_addr : felt):
    alloc_locals

    let (local namehash) = hash_name(name_len, name)
    Registry_assert_caller_is_owner(namehash)

    let (res) = Registry_get_record(namehash)

    let new_res = Registry_Record(
        owner_addr=new_owner_addr,
        resolver_addr=res.resolver_addr,
        apex_namehash=res.apex_namehash,
        exist=1)
    Registry_record_storage.write(namehash, new_res)

    return ()
end

func Registry_update_resolver{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*, new_resolver_addr : felt):
    alloc_locals

    let (local namehash) = hash_name(name_len, name)
    Registry_assert_caller_is_owner(namehash)

    let (res) = Registry_get_record(namehash)

    let new_res = Registry_Record(
        owner_addr=res.owner_addr,
        resolver_addr=new_resolver_addr,
        apex_namehash=res.apex_namehash,
        exist=1)
    Registry_record_storage.write(namehash, new_res)

    return ()
end
