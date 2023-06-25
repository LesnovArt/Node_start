import { configEnv } from "../../configENV.js";

configEnv();

import express, { ErrorRequestHandler } from "express";
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

const app = express();
const connections: Socket[] = [];

const handleRequestError: ErrorRequestHandler = (error, req, res, next) => {
  logger.error({ error, req, res }, "Internal Server Error");
  res.status(500).json({ error: "Internal Server Error" });

  next(error);
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
    app.use(loginRouter);
    app.use(registerRouter);
    app.use(BASE_URL, authMiddleware, router);

    const PORT = Number(process.env.SERVER_PORT) || 8000;
    const HOST = process.env.SERVER_HOST || "localhost";
    logConnection(`Initializing listen process...`);
    DI.server = app.listen(PORT, HOST, () => {
      logger.info(`Server is listening on http://${HOST}:${PORT}. It was started without errors.`);
      console.log(`Server is listening on http://${HOST}:${PORT}`);
    });

    DI.server.on("connection", (connection) => {
      logConnection(`Connection opening...`);

      logger.info({ connection }, "Server made new connection");
      connections.push(connection);

      connection.on("close", () => {
        logConnection(`Connection closing...`);
        logger.error({ connection }, "Server ends current connection");

        connections.filter((currentCon) => connection !== currentCon);
      });
    });
  } catch (error) {
    app.use(handleRequestError);
  }
};

const handleShutdown = async () => {
  if (DI.server) {
    await new Promise((resolve) => DI.server.close(resolve));
    logConnection("Closing server...");

    await DI.orm.close();
    logConnection("Closing data base connection...");

    connections.forEach((connection) => {
      connection.end();
      connection.destroy();
    });

    setTimeout(() => {
      logConnection("Force closing all processes...");

      logger.error("Could not end processes in time. FORCE END with status (1)");
      process.exit(1);
    }, FORCE_SHUT_DOWN_TIME);

    process.exit(0);
  }
};

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);

startServer();
