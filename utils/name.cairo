%lang starknet

from starkware.cairo.common.math import assert_nn_le
from starkware.cairo.common.cairo_builtins import HashBuiltin
from starkware.cairo.common.hash import hash2

func assert_character_is_not_punctuation{range_check_ptr}(character : felt):
    # greater than 97
    with_attr error_message("Found character that is punctuation"):
        assert_nn_le(97, character)
    end

    return ()
end

func assert_str_is_dot_stark(ending_len : felt, ending : felt*):
    with_attr error_message("String is not '.stark'"):
        assert ending_len = 6

        assert [ending] = 46  # .
        assert [ending + 1] = 115  # s
        assert [ending + 2] = 116  # t
        assert [ending + 3] = 97  # a
        assert [ending + 4] = 114  # r
        assert [ending + 5] = 107  # k
    end

    return ()
end

func assert_name_is_label_dotstark{range_check_ptr}(name_len : felt, name : felt*):
    with_attr error_message("Name is too short"):
        assert_nn_le(1, name_len)
    end

    if [name] == 46:
        assert_str_is_dot_stark(name_len, name)
        return ()
    end

    assert_character_is_not_punctuation([name])

    return assert_name_is_label_dotstark(name_len - 1, name + 1)
end

func hash_name{pedersen_ptr : HashBuiltin*}(name_len : felt, name : felt*) -> (namehash : felt):
    # Lowercase normalization
    # Hash by label, so that you can create hash for subdomain using hash of domain and string of subdomain?
    if name_len == 0:
        return (0)
    end
    let (recursive_hash) = hash_name(name_len - 1, name + 1)
    let (hash) = hash2{hash_ptr=pedersen_ptr}([name], recursive_hash)

    return (hash)
end
