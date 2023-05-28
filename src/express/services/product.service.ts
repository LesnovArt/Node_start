import { products } from "../mocks/products";

import { Product } from "../model/product";

export const getAllProducts = (): Product[] => {
  return products;
};

export const getProductById = (productId: string): Product | undefined =>
  products.find(({ id }) => id === productId);
