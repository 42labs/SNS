%lang starknet

from starkware.starknet.common.syscalls import get_caller_address
from starkware.cairo.common.cairo_builtins import HashBuiltin

from utils.string import String
from utils.name import hash_name, assert_name_is_label_dotstark

struct Record:
    member owner_addr : felt
    member resolver_addr : felt
end

@storage_var
func record(namehash : felt) -> (record : Record):
end

@view
func get_resolver{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(namehash : felt) -> (resolver_addr : felt):
    let (res) = record.read(namehash)
    return (res.resolver_addr)
end

@view
func get_resolver_by_name{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(name_len : felt, name : felt*) -> (resolver_addr : felt):
    alloc_locals

    local range_check_ptr_unrevoked = range_check_ptr
    let name_str = String(start=name, len=name_len)

    assert_name_is_label_dotstark{range_check_ptr=range_check_ptr_unrevoked}(name_str)

    let (namehash) = hash_name(name_str)
    let (resolver_addr) = get_resolver{range_check_ptr=range_check_ptr_unrevoked}(namehash)

    return (resolver_addr)
end

@external
func assert_owner{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(namehash : felt, address : felt):
    let (res) = record.read(namehash)
    assert res.owner_addr = address

    return ()
end

@external
func register{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(name_len : felt, name : felt*, owner_addr : felt, resolver_addr : felt):
    alloc_locals

    local range_check_ptr_unrevoked = range_check_ptr
    let name_str = String(start=name, len=name_len)

    assert_name_is_label_dotstark(name_str)

    let (namehash) = hash_name(name_str)

    let (res) = record.read(namehash)
    let (caller_address) = get_caller_address()

    # Either previous owner did not exist, or caller is previous owner
    assert (res.owner_addr) * (caller_address - res.owner_addr) = 0

    let new_res = Record(owner_addr=owner_addr, resolver_addr=resolver_addr)

    record.write(namehash, new_res)

    return ()
end
