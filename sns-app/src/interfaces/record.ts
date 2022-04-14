export interface Record {
  owner_addr: string;
  resolver_addr: string;
  apex_namehash: string;
}

export interface RegistrySubmission extends Record {
  name: string;
  registration_years: number;
}
