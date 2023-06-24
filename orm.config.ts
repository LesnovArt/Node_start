import * as dotenv from "dotenv";

dotenv.config();

import { Options } from "@mikro-orm/core";

import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import {
  Product,
  CartItem,
  Cart,
  Profile,
  Order,
} from "./src/express/data-layer/entities/index.js";
import { CustomMigrationGenerator } from "./src/microORM/customMigrationGenerator.js";

export const options: Options<PostgreSqlDriver> = {
  entities: [Product, CartItem, Cart, Profile, Order],
  entitiesTs: [Product, CartItem, Cart, Profile, Order],
  dbName: process.env.POSTGRES_DB || "node_rdb",
  user: process.env.POSTGRES_USER || "node_rdb",
  type: "postgresql",
  host: process.env.POSTGRES_HOST || "localhost",
  port: Number(process.env.POSTGRES_PORT) || 5432,
  password: process.env.POSTGRES_PASSWORD || "password123",
  migrations: {
    pathTs: "./src/migrations",
    path: "./dist/src/migrations",
    disableForeignKeys: false,
    glob: "!(*.d).{js,ts}",
    transactional: true,
    allOrNothing: true,
    dropTables: true,
    safe: false,
    snapshot: true,
    generator: CustomMigrationGenerator,
  },
};
