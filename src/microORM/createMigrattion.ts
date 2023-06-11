import { MikroORM } from "@mikro-orm/core";
import { options } from "../../orm.config.js";

export const createMigration = async () => {
  const orm = await MikroORM.init(options);
  const migrator = orm.getMigrator();
  await migrator.createMigration(); // creates file Migration20191019195930.ts
  console.log(`Data migration file was successfully created in migrations folder`);
  await orm.close(true);
};

createMigration();
