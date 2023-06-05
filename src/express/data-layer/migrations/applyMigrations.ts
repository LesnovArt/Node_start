import { MongoClient } from "mongodb";
import migrateMongo from "migrate-mongo";
import path from "path";

import { MONGO_URL } from "../../constants";

export const applyMigrations = async () => {
  try {
    const config = {
      mongodb: {
        url: MONGO_URL,
        options: {},
      },
      migrationsDir: path.join(__dirname, "migrations"),
    };

    const client = await MongoClient.connect(config.mongodb.url, config.mongodb.options);
    const db = client.db();

    await migrateMongo.up(db, client);
    console.log("Migrations succeeded appliing");
  } catch (error) {
    console.error("Error while migrating:", error);
  }
};
