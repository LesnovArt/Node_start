import { Schema, Document, model } from "mongoose";
import { productSchema } from "./product";
import { CartFull } from "../../models";

export const cartItemSchema = new Schema({
  product: [productSchema],
  count: { type: Number, required: true },
});

export const cartSchema = new Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  isDeleted: { type: Boolean, default: false },
  items: [cartItemSchema],
});

export const CartRepository = model<CartFull & Document>("Cart", cartSchema);
