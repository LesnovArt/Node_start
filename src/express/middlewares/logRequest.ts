import { Response, Request, NextFunction } from "express";
import { logger } from "../debug/index.js";

export const logRequest = (req: Request, res: Response, next: NextFunction) => {
  const start = new Date().getDate();

  res.on("finish", () => {
    const end = new Date().getDate();
    const duration = end - start;
    logger.info({
      method: req.method,
      path: req.path,
      duration: duration,
    });
  });
  next();
};
