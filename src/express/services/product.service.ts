import { ProductRepository } from "../data-layer/repositories";

import { Product } from "../models/product";

export const getAllProducts = async (): Promise<Product[]> =>
  ProductRepository.find()
    .exec()
    .then((data) => data)
    .catch((error) => {
      console.warn(`Error while request to DB: ${error}`);
      return [];
    });

export const getProductById = async (productId: string): Promise<Product | null> =>
  ProductRepository.findById(productId)
    .exec()
    .then((product) => product)
    .catch((error) => {
      console.warn(`Error while request to DB: ${error}`);
      return null;
    });
