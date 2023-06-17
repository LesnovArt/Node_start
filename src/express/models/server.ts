import { Request } from "express";

export type RequestWithAuthQuery = Request<
  {},
  any,
  any,
  { user: { id: string; email: string; password: string; role: string } }
>;
export type RequestWithReqBody<T> = Request<{}, any, T, any>;

export enum Role {
  ADMIN = "admin",
  CUSTOMER = "customer",
}
