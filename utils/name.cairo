%lang starknet

from starkware.cairo.common.math import assert_nn_le
from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.hash import hash2

from utils.string import String, assert_character_is_lowercase_alphabet

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

func assert_name_is_label_dotstark{range_check_ptr}(name : String):
    alloc_locals

    local range_check_ptr_unrevoked = range_check_ptr
    assert_nn_le(1, name.len)

    if [name.start] == 46:
        assert_str_is_dot_stark(name)

        return ()
    end

    assert_character_is_lowercase_alphabet{range_check_ptr=range_check_ptr_unrevoked}([name.start])

    return assert_name_is_label_dotstark{range_check_ptr=range_check_ptr_unrevoked}(
        String(start=name.start + String.SIZE, len=name.len - 1))
end

func hash_name{pedersen_ptr : HashBuiltin*}(name : String) -> (namehash : felt):
    # Lowercase normalization
    # Hash by label, so that you can create hash for subdomain using hash of domain and string of subdomain?
    if name.len == 0:
        return (0)
    end
    let new_name = String(start=name.start + String.SIZE, len=name.len - 1)
    let (recursive_hash) = hash_name(new_name)
    let (hash) = hash2{hash_ptr=pedersen_ptr}([name.start], recursive_hash)

    return (hash)
end
