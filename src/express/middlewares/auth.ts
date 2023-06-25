import { Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

import { RequestWithAuthQuery } from "../models/server.js";
import { Profile } from "../models/index.js";
import { logger } from "../debug/index.js";

export const authMiddleware = async (
  req: RequestWithAuthQuery,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    logger.warn(authHeader, "User was not successful to get into");
    return res.status(401).send("Token is required");
  }

  const [tokenType, token] = authHeader.split(" ");

  if (tokenType !== "Bearer") {
    logger.warn(tokenType, "User was not successful to get into because of wrong token type");
    return res.status(403).send("Invalid Token");
  }

  try {
    const user = jwt.verify(token, process.env.TOKEN_KEY!);

    req.query.user = user as Profile;
    logger.info({ user, token }, "User successfully got into");
  } catch (error) {
    logger.trace({ error }, "Auth error");
    return res.status(401).send("Invalid Token");
  }

  next();
};
