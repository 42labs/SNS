%lang starknet

from utils.string import String

@contract_interface
namespace IRegistryContract:
    func get_resolver(namehash : felt) -> (resolver_addr : felt):
    end

    func get_resolver_by_name(name_len : felt, name : felt*) -> (resolver_addr : felt):
    end

    func register(name_len : felt, name : felt*, owner_addr : felt, resolver_addr : felt):
    end

    func assert_owner(namehash : felt, address : felt):
    end
end
