import { Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

import { RequestWithAuthQuery } from "../models/server.js";
import { Profile } from "../models/index.js";

export const authMiddleware = async (
  req: RequestWithAuthQuery,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send("Token is required");
  }

  const [tokenType, token] = authHeader.split(" ");

  if (tokenType !== "Bearer") {
    return res.status(403).send("Invalid Token");
  }

  try {
    const user = jwt.verify(token, process.env.TOKEN_KEY!);

    req.query.user = user as Profile;
  } catch (error) {
    return res.status(401).send("Invalid Token");
  }

  next();
};
