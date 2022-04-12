%lang starknet

from contracts.registry.library import Registry_Record

@contract_interface
namespace IRegistry:
    #
    # Guards
    #

    func assert_owner(namehash : felt, address : felt):
    end

    func assert_owner_by_name(name_len : felt, name : felt*, address : felt):
    end

    #
    # Getters
    #

    func get_record(namehash : felt) -> (record : Registry_Record):
    end

    func get_record_by_name(name_len : felt, name : felt*) -> (record : Registry_Record):
    end

    func get_resolver(namehash : felt) -> (resolver_addr : felt):
    end

    func get_resolver_by_name(name_len : felt, name : felt*) -> (resolver_addr : felt):
    end

    func get_namehash(name_len : felt, name : felt*) -> (namehash : felt):
    end

    #
    # Setters
    #

    func register(
            name_len : felt, name : felt*, owner_addr : felt, resolver_addr : felt,
            registration_years : felt):
    end

    func register_subdomain(
            label_len : felt, label : felt*, parent_namehash : felt, owner_addr : felt,
            resolver_addr : felt):
    end

    func register_subdomain_with_name(
            label_len : felt, label : felt*, parent_name_len : felt, parent_name : felt*,
            owner_addr : felt, resolver_addr : felt):
    end

    func transfer_ownership(name_len : felt, name : felt*, new_owner_addr : felt):
    end

    func update_resolver(name_len : felt, name : felt*, new_resolver_addr : felt):
    end
end
