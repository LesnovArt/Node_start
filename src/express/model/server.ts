import { Request } from "express";

export type RequestWithAuthQuery = Request<{}, any, any, { user: { id: string; email: string } }>;
export type RequestWithReqBody<T> = Request<{}, any, T, any>;
