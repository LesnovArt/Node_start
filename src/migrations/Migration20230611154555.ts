import { Migration } from '@mikro-orm/migrations';

export class Migration20230611154555 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "order" ("id" varchar(255) not null, "cart_id" varchar(255) not null, "items" varchar(255) not null, "payment_type" varchar(255) not null, "payment_address" varchar(255) not null, "payment_credit_card" varchar(255) not null, "delivery_type" varchar(255) not null, "delivery_address" varchar(255) not null, "status" varchar(255) not null, "total" int not null default 0, "profile_id" varchar(255) not null, "comment" varchar(255) not null, constraint "order_pkey" primary key ("id"));');

    this.addSql('create table "product" ("id" varchar(255) not null, "title" varchar(255) not null, "price" int not null, "description" varchar(255) not null, constraint "product_pkey" primary key ("id"));');

    this.addSql('create table "profile" ("id" varchar(255) not null, "email" varchar(255) not null, constraint "profile_pkey" primary key ("id"));');

    this.addSql('create table "cart" ("id" varchar(255) not null, "is_deleted" boolean not null default false, "profile_id" varchar(255) not null, "order_id" varchar(255) null, constraint "cart_pkey" primary key ("id"));');
    this.addSql('alter table "cart" add constraint "cart_profile_id_unique" unique ("profile_id");');
    this.addSql('alter table "cart" add constraint "cart_order_id_unique" unique ("order_id");');

    this.addSql('create table "cart_item" ("id" varchar(255) not null, "cart_id" varchar(255) not null, "count" int not null, "product_id" varchar(255) not null, constraint "cart_item_pkey" primary key ("id"));');

    this.addSql('alter table "cart" add constraint "cart_profile_id_foreign" foreign key ("profile_id") references "profile" ("id") on update cascade;');
    this.addSql('alter table "cart" add constraint "cart_order_id_foreign" foreign key ("order_id") references "order" ("id") on update cascade on delete set null;');

    this.addSql('alter table "cart_item" add constraint "cart_item_cart_id_foreign" foreign key ("cart_id") references "cart" ("id") on update cascade;');
    this.addSql('alter table "cart_item" add constraint "cart_item_product_id_foreign" foreign key ("product_id") references "product" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "cart" drop constraint "cart_order_id_foreign";');

    this.addSql('alter table "cart_item" drop constraint "cart_item_product_id_foreign";');

    this.addSql('alter table "cart" drop constraint "cart_profile_id_foreign";');

    this.addSql('alter table "cart_item" drop constraint "cart_item_cart_id_foreign";');

    this.addSql('drop table if exists "order" cascade;');

    this.addSql('drop table if exists "product" cascade;');

    this.addSql('drop table if exists "profile" cascade;');

    this.addSql('drop table if exists "cart" cascade;');

    this.addSql('drop table if exists "cart_item" cascade;');
  }

}
