%lang starknet

from starkware.cairo.common.math import assert_nn_le

struct String:
    member start : felt*
    member len : felt
end

func assert_character_is_lowercase_alphabet{range_check_ptr}(character : felt):
    # between 97 and 122
    assert_nn_le(97, character)
    assert_nn_le(character, 122)

    return ()
end