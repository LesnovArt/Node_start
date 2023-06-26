import { configEnv } from "../../configENV.js";

configEnv();

import express from "express";
import "reflect-metadata";
import bodyParser from "body-parser";
import { MikroORM, RequestContext } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { Socket } from "node:net";

import { defineRepositories, DI, upMigration } from "../microORM/index.js";
import { options } from "../../orm.config.js";
import { authMiddleware } from "./middlewares/auth.js";
import { healthRouter, loginRouter, registerRouter, router } from "./routes/index.js";
import { BASE_URL, FORCE_SHUT_DOWN_TIME } from "./constants.js";
import { logConnection, logger } from "./debug/index.js";
import { logRequest } from "./middlewares/logRequest.js";

const app = express();
const connections: Socket[] = [];

const handleShutdown = async () => {
  logConnection("Closing server...");
  if (DI.server) {
    await new Promise((resolve) => DI.server.close(resolve));

    await DI.orm.close();
    logConnection("Closing data base connection...");

    connections.forEach((connection) => {
      connection.end();
      connection.destroy();
    });

    setTimeout(() => {
      logConnection("Force closing all processes...");

      process.exit(1);
    }, FORCE_SHUT_DOWN_TIME);
    process.exit(0);
  }
};

const startServer = async () => {
  try {
    logConnection(`App starting...`);
    logConnection(`DB initializing...`);
    DI.orm = await MikroORM.init<PostgreSqlDriver>(options);

    logConnection(`Creating repositories...`);
    defineRepositories();

    logConnection(`Migration running...`);
    await upMigration();

    app.use(bodyParser.json());
    logConnection(`Request context connecting...`);
    app.use((_req, _res, next) => RequestContext.create(DI.orm.em, next));
    logConnection(`Connecting routes...`);
    app.get("/", (_req, res) =>
      res.json({
        message:
          "Welcome to MicroORM express TS example endpoint `/health` endpoint to check if it is working",
      })
    );

    app.use(healthRouter);
    app.use(logRequest, loginRouter);
    app.use(logRequest, registerRouter);
    app.use(BASE_URL, logRequest, authMiddleware, router);

    const PORT = Number(process.env.SERVER_PORT) || 8000;
    const HOST = process.env.SERVER_HOST || "localhost";
    logConnection(`Initializing listen process...`);
    DI.server = app.listen(PORT, HOST, () => {
      console.log(`Server is listening on http://${HOST}:${PORT}`);
    });

    DI.server.on("connection", (connection) => {
      logConnection(`Connection opening...`);
      connections.push(connection);

      connection.on("close", () => {
        logConnection(`Connection closing...`);

        connections.filter((currentCon) => connection !== currentCon);
      });
    });
  } catch (error) {
    logger.error({ error }, "Internal Server Error");
    handleShutdown();
  }
};

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);

startServer();
