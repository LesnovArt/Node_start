import { Migration } from '@mikro-orm/migrations';

export class Migration20230617090923 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "profile" add column "password" varchar(255) not null, add column "role" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "profile" drop column "password";');
    this.addSql('alter table "profile" drop column "role";');
  }

}
