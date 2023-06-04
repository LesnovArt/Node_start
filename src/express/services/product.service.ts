import { ProductModel } from "../data-layer/models";

import { Product } from "../models/product";

export const getAllProducts = async (): Promise<Product[]> =>
  ProductModel.find()
    .exec()
    .then((data) => data)
    .catch((error) => {
      console.warn(`Error while request to DB: ${error}`);
      return [];
    });

export const getProductById = async (productId: string): Promise<Product | null> =>
  ProductModel.findById(productId)
    .exec()
    .then((product) => product)
    .catch((error) => {
      console.warn(`Error while request to DB: ${error}`);
      return null;
    });
