import { Response, NextFunction } from "express";

import * as AuthController from "../controllers/profile.controller";
import { RequestWithAuthQuery } from "../model/server";

const checkHeaders = (headers: unknown[]): boolean =>
  headers.every((header) => header && typeof header === "string");

export const authMiddleware = (req: RequestWithAuthQuery, res: Response, next: NextFunction) => {
  // we define headers as strings, but still need to check if that's true
  const id = (req.headers["x-user-id"] as string) || "profile-id-1";
  const email = (req.headers["x-email"] as string) || "ann@google.com";

  if (checkHeaders([id, email])) {
    AuthController.auth(id, email);
    const user = {
      id: id,
      email: email,
    };

    req.query.user = user;
  } else {
    res
      .status(404)
      .send(
        `User with provided email: ${email} was not found. Please, check the correctness of login data and try again`
      );
    return;
  }

  next();
};