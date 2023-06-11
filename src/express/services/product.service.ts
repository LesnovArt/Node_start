import { EntityRepository } from "@mikro-orm/core";

import { Product } from "../data-layer/entities/index.js";
import { DI } from "../../microORM/index.js";

export const getAllProducts = async (): Promise<Product[]> => {
  const productRepository: EntityRepository<Product> = DI.productRepository;
  return productRepository.findAll();
};

export const getProductById = async (productId: string): Promise<Product | null> => {
  const productRepository = DI.productRepository.getEntityManager();
  return productRepository.findOneOrFail(Product, { id: productId });
};
