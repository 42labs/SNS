%lang starknet

from utils.string import String

@contract_interface
namespace IRegistryContract:
    func get_resolver(namehash : felt) -> (resolver_addr : felt):
    end

    func get_resolver_by_name(name_len : felt, name : felt*) -> (resolver_addr : felt):
    end

    func register(
            name_len : felt, name : felt*, owner_addr : felt, resolver_addr : felt,
            registration_years : felt):
    end

    func assert_owner(namehash : felt, address : felt):
    end

    func transfer_ownership(name_len : felt, name : felt*, new_owner_addr : felt):
    end

    func update_resolver(name_len : felt, name : felt*, new_resolver_addr : felt):
    end
end
