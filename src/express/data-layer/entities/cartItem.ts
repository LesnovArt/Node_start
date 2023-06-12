import { Property, Entity, PrimaryKey, ManyToOne } from "@mikro-orm/core";

import { Cart } from "./cart.js";
import { Product } from "./product.js";

@Entity()
export class CartItem {
  @PrimaryKey()
  id!: string;

  @ManyToOne(() => Cart, { lazy: true })
  cart!: Promise<Cart> | Cart;

  @Property()
  count!: number;

  @ManyToOne(() => Product)
  product!: Product;

  constructor(id: string, product: Product, cart: Promise<Cart> | Cart, count: number) {
    this.id = id;
    this.cart = cart;
    this.count = count;
    this.product = product;
  }
}
