import { Request } from "express";

export type RequestWithAuthQuery = Request<
  object,
  unknown,
  unknown,
  { user: { id: string; email: string; password: string; role: string } }
>;
export type RequestWithReqBody<T> = Request<object, object, T, object>;

export enum Role {
  ADMIN = "admin",
  CUSTOMER = "customer",
}
