import { Collection, Entity, PrimaryKey, Property } from "@mikro-orm/core";

import { CartItem } from "./cartItem.js";

@Entity()
export class Order {
  @PrimaryKey()
  id!: string;

  @Property()
  cartId!: string;

  @Property()
  items!: Collection<CartItem>;

  @Property()
  paymentType!: string;

  @Property()
  paymentAddress!: string;

  @Property()
  paymentCreditCard!: string;

  @Property()
  deliveryType!: string;

  @Property()
  deliveryAddress!: string;

  @Property()
  status!: string;

  @Property()
  total!: number;

  @Property()
  profileId!: string;

  @Property()
  comment?: string;

  constructor(
    id: string,
    status: string,
    deliveryType: string,
    deliveryAddress: string,
    paymentType: string,
    paymentAddress: string,
    paymentCreditCard: string,
    total: number,
    profileId: string,
    cartId: string,
    items: Collection<CartItem>,
    comment?: string
  ) {
    this.id = id;
    this.cartId = cartId;
    this.items = items;
    this.status = status;
    this.total = total || 0;
    this.comment = comment;
    this.deliveryType = deliveryType;
    this.deliveryAddress = deliveryAddress;
    this.paymentType = paymentType;
    this.paymentAddress = paymentAddress;
    this.paymentCreditCard = paymentCreditCard;
    this.profileId = profileId;
  }
}
