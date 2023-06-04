import { Schema, Document, model } from "mongoose";
import { cartItemSchema } from "./cart";
import { Order } from "../../models";

export const orderSchema = new Schema({
  id: { type: String, required: true },
  userId: { type: String, required: true },
  cartId: { type: String, required: true },
  items: [cartItemSchema],
  payment: {
    type: { type: String, required: true },
    address: { type: String, required: true },
    creditCard: { type: String, required: true },
  },
  delivery: {
    type: { type: String, required: true },
    address: { type: String, required: true },
  },
  comments: { type: String },
  status: { type: String, required: true },
  total: { type: Number },
});

export const OrderModel = model<Order& Document>("Order", orderSchema);
