import { MikroORM } from "@mikro-orm/core";

import { options } from "../../orm.config.js";
import { logConnection } from "../express/debug/index.js";

export const upMigration = async () => {
  const orm = await MikroORM.init(options);
  const migrator = orm.getMigrator();
  await migrator.up();
  logConnection(`Data was successfully migrated`);

  await orm.close(true);
};
