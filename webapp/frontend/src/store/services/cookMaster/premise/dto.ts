export interface CreateAddressDto {
  streetNumber: string;
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface GetPremiseDto {
  premiseId: number;
}

export interface PatchPremiseDto {
  streetNumber?: string;
  streetName?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}
