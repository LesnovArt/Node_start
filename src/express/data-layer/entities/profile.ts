import { Entity, OneToOne, PrimaryKey, Property, Ref } from "@mikro-orm/core";

import { Cart } from "./cart.js";

@Entity()
export class Profile {
  @PrimaryKey()
  id!: string;

  @Property()
  email!: string;

  @OneToOne(() => Cart, "profile", { nullable: true })
  cart?: Ref<Cart>;

  constructor(id: string, email: string) {
    this.id = id;
    this.email = email;
  }
}
