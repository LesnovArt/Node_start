import { MikroORM } from "@mikro-orm/core";

import { options } from "../../orm.config.js";
import { logConnection, logger } from "../express/debug/index.js";

export const upMigration = async () => {
  try {
    const orm = await MikroORM.init(options);

    const migrator = orm.getMigrator();
    await migrator.up();
    logConnection(`Data was successfully migrated`);

    await orm.close(true);
  } catch (error) {
    logger.error({ error }, `Migration failed`);
  }
};
