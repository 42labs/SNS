from starkware.crypto.signature.signature import pedersen_hash


def str_to_felt(text):
    b_text = bytes(text, "utf-8")
    return int.from_bytes(b_text, "big")


def hash_name(text):
    if len(text) == 0:
        return 0
    recursive_hash = hash_name(text[1:])
    return pedersen_hash(str_to_felt(text[0]), recursive_hash)


def encode_name(name):
    return [str_to_felt(c) for c in list(name)]
