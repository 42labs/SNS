%lang starknet

from starkware.starknet.common.syscalls import get_caller_address
from starkware.cairo.common.hash import hash2
from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.math import assert_nn_le

from utils.string import String

# TODO move to separate file
func assert_str_is_dot_stark{range_check_ptr}(ending : String):
    assert ending.len = 6

    tempvar str_ptr = ending.start
    assert [str_ptr] = 46  # .

    str_ptr = str_ptr + String.SIZE
    assert [str_ptr] = 115  # s

    str_ptr = str_ptr + String.SIZE
    assert [str_ptr] = 116  # t

    str_ptr = str_ptr + String.SIZE
    assert [str_ptr] = 97  # a

    str_ptr = str_ptr + String.SIZE
    assert [str_ptr] = 114  # r

    str_ptr = str_ptr + String.SIZE
    assert [str_ptr] = 107  # k

    return ()
end

func assert_character_is_lowercase_alphabet{range_check_ptr}(character : felt):
    # between 97 and 122
    assert_nn_le(97, character)
    assert_nn_le(character, 122)

    return ()
end

func assert_name_is_label_dotstark{range_check_ptr}(name : String):
    alloc_locals

    local range_check_ptr_unrevoked = range_check_ptr
    assert_nn_le(1, name.len)

    if [name.start] == 46:
        assert_str_is_dot_stark(name)

        return ()
    end

    assert_character_is_lowercase_alphabet{range_check_ptr=range_check_ptr_unrevoked}([name.start])

    return assert_name_is_label_dotstark{range_check_ptr=range_check_ptr_unrevoked}(String(start=name.start + String.SIZE, len=name.len-1))
end

func hash_name{pedersen_ptr : HashBuiltin*}(name : String) -> (namehash : felt):
    # Lowercase normalization
    # Hash by label, so that you can create hash for subdomain using hash of domain and string of subdomain?
    if name.len == 0:
        return (0x0)
    end
    let new_name = String(start=name.start + String.SIZE, len=name.len - 1)
    let (recursive_hash) = hash_name(new_name)
    let (hash) = hash2{hash_ptr=pedersen_ptr}([name.start], recursive_hash)

    return (hash)
end

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

func only_owner{syscall_ptr : felt*, pedersen_ptr : HashBuiltin*, range_check_ptr}(namehash : felt):
    let (caller_address) = get_caller_address()
    let (res) = record.read(namehash)
    assert res.owner_addr = caller_address

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
