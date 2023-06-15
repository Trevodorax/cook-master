export interface User {
  id: number;
  email: string;
  hash: string;
  firstName?: string | null;
  lastName?: string | null;
  userType: string;
  admin?: Admin | null;
  client?: Client | null;
  contractor?: Contractor | null;
  clientId?: number | null;
  adminId?: number | null;
  contractorId?: number | null;
}

export interface Admin {
  id: number;
  user?: User | null;
  isConfirmed: boolean;
  isItemAdmin: boolean;
  isClientAdmin: boolean;
  isContractorAdmin: boolean;
}

export interface Client {
  id: number;
  user?: User | null;
  fidelityPoints: number;
  Address?: Address | null;
  events: Event[];
  addressId?: number | null;
}

export interface Contractor {
  id: number;
  user?: User | null;
  presentation?: string | null;
  events: Event[];
}

export interface Address {
  id: number;
  streetNumber: string;
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
  client?: Client | null;
}

export interface CookMasterEvent {
  id: number;
  type: string;
  name: string;
  description?: string;
  startTime: Date;
  durationMin: number;
  animator?: Contractor | null;
  clients: Client[];
  contractorId?: number | null;
}

export type serializedCookMasterEvent = Omit<CookMasterEvent, "startTime"> & {
  startTime: string;
};
