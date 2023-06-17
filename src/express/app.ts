import dotenv from "dotenv";
dotenv.config();

import express from "express";
import "reflect-metadata";
import bodyParser from "body-parser";
import { MikroORM, RequestContext } from "@mikro-orm/core";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";

import { defineRepositories, DI, upMigration } from "../microORM/index.js";
import { options } from "../../orm.config.js";
import { authMiddleware } from "./middlewares/auth.js";
import { router } from "./routes/index.js";
import { BASE_URL, PORT, HOST } from "./constants.js";
import { loginRouter } from "./routes/login.routes.js";
import { registerRouter } from "./routes/register.routes.js";

const app = express();

const startServer = async () => {
  DI.orm = await MikroORM.init<PostgreSqlDriver>(options);
  console.log(`Data base was successfully initialized`);

  defineRepositories();
  await upMigration();

  app.use(bodyParser.json());
  app.use((req, res, next) => RequestContext.create(DI.orm.em, next));
  app.get("/", (req, res) =>
    res.json({
      message: "Welcome to MikroORM express TS example, try CRUD on /author and /book endpoints!",
    })
  );

  app.use(loginRouter);
  app.use(registerRouter);
  app.use(BASE_URL, authMiddleware, router);

  DI.server = app.listen(PORT, HOST, () => {
    console.log(`Server is listening on http://${HOST}:${PORT}`);
  });
};

startServer();
