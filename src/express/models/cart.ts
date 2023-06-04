import { Product } from "./product";
import { Profile } from "./profile";

export interface Cart {
  id: string;
  items: CartItem[];
}

export type CartFull = Cart & { userId: Profile["id"]; isDeleted: boolean };

export interface CartItem {
  product: Product;
  count: number;
}
