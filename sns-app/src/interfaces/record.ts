export interface RegistryRecord {
  ownerAddress: string;
  resolverAddress: string;
  apexNamehash: string;
}

export interface RegistrySubmission extends RegistryRecord {
  name: string;
  registrationYears: number;
}
