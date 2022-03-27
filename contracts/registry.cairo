%lang starknet

from starkware.starknet.common.syscalls import get_caller_address, get_block_timestamp
from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.math import assert_nn_le, assert_not_equal

from utils.name import hash_name, assert_name_is_label_dotstark

const MAX_REGISTRATION_YEARS = 10
const SECONDS_IN_YEAR = 31556926
# TODO Messes up leap year (365.24 days) - Can use hint + python library to do this?

# STRUCTS

struct Record:
    member owner_addr : felt  # Need to verify that this is an account contract?
    member resolver_addr : felt
    member expiry_timestamp : felt
end

# HELPER FUNCS

func assert_record_is_not_expired{syscall_ptr : felt*, range_check_ptr}(res : Record):
    let (current_timestamp) = get_block_timestamp()
    with_attr error_message("Record is expired"):
        assert_nn_le(current_timestamp, res.expiry_timestamp)
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

# PUBLIC FUNCTIONS

@view
func get_resolver{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        namehash : felt) -> (resolver_addr : felt):
    let (res) = record.read(namehash)

    with_attr error_message("Record does not exist"):
        assert_not_equal(res.expiry_timestamp, 0)
    end

    assert_record_is_not_expired(res)

    return (res.resolver_addr)
end

@view
func get_namehash{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*) -> (namehash : felt):
    let (namehash) = hash_name(name_len, name)

    return (namehash)
end

@view
func get_resolver_by_name{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*) -> (resolver_addr : felt):
    alloc_locals

    local range_check_ptr = range_check_ptr

    assert_name_is_label_dotstark(name_len, name)

    let (namehash) = hash_name(name_len, name)
    let (resolver_addr) = get_resolver(namehash)

    return (resolver_addr)
end

@external
func assert_owner{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        namehash : felt, address : felt):
    let (res) = record.read(namehash)

    assert_record_is_not_expired(res)

    with_attr error_message("Insufficient permission (not owner)."):
        assert res.owner_addr = address
    end

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
    # TODO: Assert owner is account contract?
    # TODO: Assert registry address conforms to contract interface?

    let (namehash) = hash_name(name_len, name)

    let (res) = record.read(namehash)
    let (caller_address) = get_caller_address()
    let (current_timestamp) = get_block_timestamp()

    # # Check that previous owner does not exist or the domain is expired
    assert_nn_le(current_timestamp * res.owner_addr, res.expiry_timestamp)

    # # Create or update entry
    let expiry_timestamp = current_timestamp + registration_years * SECONDS_IN_YEAR
    let new_res = Record(
        owner_addr=owner_addr, resolver_addr=resolver_addr, expiry_timestamp=expiry_timestamp)

    record.write(namehash, new_res)

    return ()
end

@external
func transfer_ownership{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*, new_owner_addr : felt):
    alloc_locals

    let (local namehash) = hash_name(name_len, name)
    assert_caller_is_owner(namehash)

    let (res) = record.read(namehash)

    # TODO: Assert new owner is account contract?

    let new_res = Record(
        owner_addr=new_owner_addr,
        resolver_addr=res.resolver_addr,
        expiry_timestamp=res.expiry_timestamp)
    record.write(namehash, new_res)

    ret
end

@external
func update_resolver{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(
        name_len : felt, name : felt*, new_resolver_addr : felt):
    alloc_locals

    let (local namehash) = hash_name(name_len, name)
    assert_caller_is_owner(namehash)

    let (res) = record.read(namehash)

    # TODO: Assert registry address conforms to contract interface

    let new_res = Record(
        owner_addr=res.owner_addr,
        resolver_addr=new_resolver_addr,
        expiry_timestamp=res.expiry_timestamp)
    record.write(namehash, new_res)

    ret
end
