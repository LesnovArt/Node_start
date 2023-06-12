import { Product } from "./product.js";
import { Profile } from "./profile.js";

export interface Cart {
  id: string;
  items: CartItem[];
}

export type CartFull = Cart & { userId: Profile["id"]; isDeleted: boolean };

export interface CartItem {
  product: Product;
  count: number;
}
