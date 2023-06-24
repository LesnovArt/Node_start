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
import { logConnection } from "./debug/index.js";

const app = express();
const connections: Socket[] = [];

const handleRequestError: ErrorRequestHandler = (error, _req, res, next) => {
  logConnection(`Endpoint and DB connection failed with error ${error}`);
  res.status(500).json({ error: "Internal Server Error" });

  next(error);
};

const startServer = async () => {
  try {
    logConnection(`App starting...`);
    logConnection(`DB initializing...`);
    DI.orm = await MikroORM.init<PostgreSqlDriver>(options);
    logConnection(`Data base was successfully initialized `);

    defineRepositories();
    logConnection(`Creating repositories...`);
    await upMigration();

    app.use(bodyParser.json());
    app.use((_req, _res, next) => RequestContext.create(DI.orm.em, next));
    logConnection(`Connecting routes...`);
    app.get("/", (_req, res) =>
      res.json({
        message:
          "Welcome to MicroORM express TS example endpoint `/health` endpoint to check if it is working"!,
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
      console.log(`Server is listening on http://${HOST}:${PORT}`);
    });

    DI.server.on("connection", (connection) => {
      connections.push(connection);

      connection.on("close", () => {
        connections.filter((currentCon) => connection !== currentCon);
      });
    });
  } catch (error) {
    logConnection(`Endpoint and DB connection failed with error ${error}`);
    app.use(handleRequestError);
  }
};

const handleShutdown = async () => {
  if (DI.server) {
    await new Promise((resolve) => DI.server.close(resolve));

    logConnection("Closing server...");
    console.log("Server closed");

    await DI.orm.close();
    logConnection("Closing data base connection...");
    console.log("Data base connection closed");

    connections.forEach((connection) => {
      connection.end();
      connection.destroy();
    });

    setTimeout(() => {
      logConnection("Force closing all processes...");

      console.log("Could not end processes in time. FORCE END!");
      process.exit(1);
    }, FORCE_SHUT_DOWN_TIME);

    process.exit(0);
  }
};

process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);

startServer();
