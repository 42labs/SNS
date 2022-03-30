%lang starknet

from starkware.starknet.common.syscalls import get_caller_address, get_block_timestamp
from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.math import assert_nn_le, assert_not_equal

from utils.name import (
    hash_name, hash_name_with_base, assert_name_is_label_dotstark, assert_name_is_label_dot)

const MAX_REGISTRATION_YEARS = 10
const SECONDS_IN_YEAR = 31556926

# STRUCTS

struct Record:
    member owner_addr : felt
    member resolver_addr : felt
    member apex_namehash : felt  # namehash of the apex domain, e.g. 'foo.stark'
end

# HELPER FUNCS

func assert_registration_is_not_expired{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(namehash : felt):
    alloc_locals

    let (local current_timestamp) = get_block_timestamp()
    let (expiration_timestamp) = expiration.read(namehash)

    with_attr error_message("Record does not exist"):
        assert_not_equal(expiration_timestamp, 0)
    end

    with_attr error_message("Record is expired"):
        assert_nn_le(current_timestamp, expiration_timestamp)
    end

    return ()
end

func assert_caller_is_owner{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        namehash : felt):
    let (caller_addess) = get_caller_address()
    assert_owner(namehash, caller_addess)
    return ()
end

# STORAGE

@storage_var
func record(namehash : felt) -> (record : Record):
end

@storage_var
func expiration(namehash : felt) -> (expiration_timestamp : felt):
end

# PUBLIC FUNCTIONS

@view
func get_record{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        namehash : felt) -> (record : Record):
    alloc_locals

    let (local res) = record.read(namehash)

    assert_registration_is_not_expired(res.apex_namehash)

    return (res)
end

@view
func get_record_by_name{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*) -> (record : Record):
    alloc_locals

    local range_check_ptr = range_check_ptr

    let (namehash) = hash_name(name_len, name)
    let (res) = get_record(namehash)

    return (res)
end

@view
func get_resolver{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        namehash : felt) -> (resolver_addr : felt):
    let (res) = get_record(namehash)

    return (res.resolver_addr)
end

@view
func get_resolver_by_name{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*) -> (resolver_addr : felt):
    alloc_locals

    local range_check_ptr = range_check_ptr

    let (namehash) = hash_name(name_len, name)
    let (resolver_addr) = get_resolver(namehash)

    return (resolver_addr)
end

@view
func get_namehash{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*) -> (namehash : felt):
    let (namehash) = hash_name(name_len, name)

    return (namehash)
end

@external
func assert_owner{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        namehash : felt, address : felt):
    alloc_locals

    let (local res) = get_record(namehash)

    assert_registration_is_not_expired(namehash)

    with_attr error_message("Insufficient permission (not owner)"):
        assert res.owner_addr = address
    end

    return ()
end

@external
func assert_owner_by_name{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*, address : felt):
    alloc_locals

    local range_check_ptr = range_check_ptr

    let (namehash) = hash_name(name_len, name)

    assert_owner(namehash, address)
    return ()
end

@external
func register{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*, owner_addr : felt, resolver_addr : felt,
        registration_years : felt):
    alloc_locals

    local range_check_ptr = range_check_ptr

    # Validate inputs
    assert_name_is_label_dotstark(name_len, name)
    assert_nn_le(registration_years, MAX_REGISTRATION_YEARS)

    let (namehash) = hash_name(name_len, name)

    let (res) = record.read(namehash)
    let (expiration_timestamp) = expiration.read(namehash)
    let (caller_address) = get_caller_address()
    let (current_timestamp) = get_block_timestamp()

    # Create new entry if entry does not exist (all values on the struct will be 0)
    # or if the registration is expired
    with_attr error_message("Domain already registered, and not expired yet"):
        assert_nn_le(expiration_timestamp, current_timestamp)
    end

    let expiration_timestamp = current_timestamp + registration_years * SECONDS_IN_YEAR
    expiration.write(namehash, expiration_timestamp)
    let new_res = Record(owner_addr=owner_addr, resolver_addr=resolver_addr, apex_namehash=namehash)
    record.write(namehash, new_res)

    return ()
end

@external
func register_subdomain{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        label_len : felt, label : felt*, parent_namehash : felt, owner_addr : felt,
        resolver_addr : felt):
    alloc_locals

    local range_check_ptr = range_check_ptr

    # Validate label
    assert_name_is_label_dot(label_len, label)

    # Validate caller
    let (parent_record) = record.read(parent_namehash)
    assert_registration_is_not_expired(parent_namehash)
    assert_caller_is_owner(parent_namehash)
    let (expiration_timestamp) = expiration.read(parent_record.apex_namehash)

    let (subdomain_namehash) = hash_name_with_base(label_len, label, parent_namehash)

    let (subdomain_record) = record.read(subdomain_namehash)

    # Create new entry if entry does not exist
    with_attr error_message("Subdomain already registered, please use update function"):
        assert_nn_le(0, subdomain_record.apex_namehash)
    end

    let new_res = Record(
        owner_addr=owner_addr,
        resolver_addr=resolver_addr,
        apex_namehash=parent_record.apex_namehash)
    record.write(subdomain_namehash, new_res)

    return ()
end

@external
func register_subdomain_with_name{
        syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        label_len : felt, label : felt*, parent_name_len : felt, parent_name : felt*,
        owner_addr : felt, resolver_addr : felt):
    let (parent_namehash) = hash_name(parent_name_len, parent_name)
    register_subdomain(label_len, label, parent_namehash, owner_addr, resolver_addr)

    return ()
end

@external
func transfer_ownership{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*, new_owner_addr : felt):
    alloc_locals

    let (local namehash) = hash_name(name_len, name)
    assert_caller_is_owner(namehash)

    let (res) = get_record(namehash)

    let new_res = Record(
        owner_addr=new_owner_addr,
        resolver_addr=res.resolver_addr,
        apex_namehash=res.apex_namehash)
    record.write(namehash, new_res)

    ret
end

@external
func update_resolver{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*, new_resolver_addr : felt):
    alloc_locals

    let (local namehash) = hash_name(name_len, name)
    assert_caller_is_owner(namehash)

    let (res) = get_record(namehash)

    let new_res = Record(
        owner_addr=res.owner_addr,
        resolver_addr=new_resolver_addr,
        apex_namehash=res.apex_namehash)
    record.write(namehash, new_res)

    ret
end
