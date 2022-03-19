%lang starknet

from utils.string import String

@contract_interface
namespace IRegistryContract:
    func get_resolver(namehash : felt) -> (resolver_addr : felt):
    end

    func get_resolver_by_name(name : String) -> (resolver_addr : felt):
    end

    func register(name : String, owner_addr : felt, resolver_addr : felt):
    end
end
