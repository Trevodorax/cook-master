export interface User {
  id: number;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  userType: string;
  profilePicture: string;
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
  subscriptionLevel: number;
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

export type SerializedCookMasterEvent = Omit<CookMasterEvent, "startTime"> & {
  startTime: string;
};

export type userType = "any" | "contractor" | "client" | "admin";

export interface UserInfo {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  userType: userType;
  admin: {
    isConfirmed: boolean;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
}

export interface GenericError {
  data: {
    error: string;
    message: string;
    statusCode: number;
  };
}

export interface CreateAccountRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: userType;
}

export interface UserSearchParams {
  search: string | null;
  userType: userType | null;
}

export interface Lesson {
  id: number;
  name: string;
  description: string;
  content: string;
  courseId?: number;
  index: number;
}

export interface Course {
  id: number;
  name: string;
  description: string;
  lessons: Lesson[];
  contractorId?: number;
  clients: Client[];
}

export interface Message {
  id: number;
  createdAt: Date;
  content: string;
  senderId: number;
  sender: User;
  recipientId: number;
  recipient: User;
}

export interface Room {
  id: number;
  capacity: number;
  premiseId: number;
}

export interface Premise {
  id: number;
  addressId: number;
  rooms: Room[];
  address: Address;
}
