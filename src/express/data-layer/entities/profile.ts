import { Entity, OneToOne, PrimaryKey, Property, Ref } from "@mikro-orm/core";

import { Cart } from "./cart.js";
import { Role } from "../../models/index.js";

@Entity()
export class Profile {
  @PrimaryKey()
  id!: string;

  @Property()
  email!: string;

  @Property()
  password!: string;

  @Property()
  role!: Role;

  @OneToOne(() => Cart, "profile", { nullable: true })
  cart?: Ref<Cart>;

  constructor(id: string, email: string, password: string, role: Role) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.role = role;
  }
}
