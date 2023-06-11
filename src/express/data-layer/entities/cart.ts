import { Collection, Entity, OneToMany, PrimaryKey, OneToOne, Property } from "@mikro-orm/core";

import { Profile } from "./profile.js";
import { CartItem } from "./cartItem.js";
import { Order } from "./order.js";

@Entity()
export class Cart {
  @PrimaryKey()
  id!: string;

  @Property()
  isDeleted: boolean;

  @OneToMany(() => CartItem, (item) => item.cart, { eager: true })
  items: Collection<CartItem> = new Collection<CartItem>(this);

  @OneToOne(() => Profile, { lazy: true })
  profile: Promise<Profile> | Profile;

  @OneToOne(() => Order, { nullable: true })
  order?: Order;

  constructor(id: string, profile: Promise<Profile> | Profile, isDeleted?: boolean) {
    this.id = id;
    this.profile = profile;
    this.isDeleted = isDeleted || false;
  }
}
