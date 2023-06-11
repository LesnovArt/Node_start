import { TSMigrationGenerator } from "@mikro-orm/migrations";

export class CustomMigrationGenerator extends TSMigrationGenerator {
  protected generateFile(content: string, className: string): string {
    const fileName = className.replace(/([A-Z])/g, "_$1").toLowerCase();
    return `${fileName}.mjs`;
  }
}
