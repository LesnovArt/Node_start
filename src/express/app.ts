import dotenv from "dotenv";
dotenv.config();

import express from "express";
import "reflect-metadata";
import bodyParser from "body-parser";
import { MikroORM, RequestContext } from "@mikro-orm/core";

import { options } from "../../orm.config.js";
import { authMiddleware } from "./middlewares/auth.js";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { router } from "./routes/index.js";
import { BASE_URL, PORT, HOST } from "./constants.js";
import { defineRepositories, DI, seedDatabase, upMigration } from "../microORM/index.js";

const app = express();

const startServer = async () => {
  DI.orm = await MikroORM.init<PostgreSqlDriver>(options);
  console.log(`Data base was successfully initialized`);

  defineRepositories();
  await upMigration();
  await seedDatabase();

  app.use(bodyParser.json());
  app.use((req, res, next) => RequestContext.create(DI.orm.em, next));
  app.get("/", (req, res) =>
    res.json({
      message: "Welcome to MikroORM express TS example, try CRUD on /author and /book endpoints!",
    })
  );
  app.use(authMiddleware);
  app.use(BASE_URL, router);

  DI.server = app.listen(PORT, HOST, () => {
    console.log(`Server is listening on http://${HOST}:${PORT}`);
  });
};

startServer();
