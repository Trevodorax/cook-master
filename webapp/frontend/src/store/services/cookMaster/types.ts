// user.ts
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

// admin.ts
export interface Admin {
  id: number;
  user?: User | null;
  isConfirmed: boolean;
  isItemAdmin: boolean;
  isClientAdmin: boolean;
  isContractorAdmin: boolean;
}

// client.ts
export interface Client {
  id: number;
  user?: User | null;
  fidelityPoints: number;
  Address?: Address | null;
  events: Event[];
  addressId?: number | null;
}

// contractor.ts
export interface Contractor {
  id: number;
  user?: User | null;
  presentation?: string | null;
  events: Event[];
}

// address.ts
export interface Address {
  id: number;
  streetNumber: string;
  streetName: string;
  city: string;
  postalCode: string;
  country: string;
  client?: Client | null;
}

// event.ts
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
