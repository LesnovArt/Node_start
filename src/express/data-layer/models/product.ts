import { Schema, Document, model } from "mongoose";
import { Product } from "../../models";

export const productSchema = new Schema<Product>({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
});

export const ProductModel = model<Product & Document>("Product", productSchema);
