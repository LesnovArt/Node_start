import { Role } from "./server.js";

export interface Profile {
  id: string;
  email: string;
  password: string;
  role: Role;
  cartId?: string;
}
