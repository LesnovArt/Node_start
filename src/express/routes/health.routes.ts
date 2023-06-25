import express from "express";

import { DI } from "../../microORM/index.js";
import { logConnection } from "../debug/index.js";

export const healthRouter = express.Router();

healthRouter.get("/health", async (req, res) => {
  logConnection(`checking connection...`);
  const isDBConnected = await DI.orm.isConnected();
  if (isDBConnected) {
    logConnection(`connection was established`);

    res.status(200).json({
      message: "Application is healthy",
    });
  } else {
    logConnection(`connection failed`);

    res.status(500).json({ message: "Server or Data base failed connection" });
  }
});
