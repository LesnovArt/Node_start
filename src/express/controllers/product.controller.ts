import { Response, Request } from "express";

import * as productAPI from "../services/product.service.js";
import { logger } from "../debug/index.js";

export const getProducts = async (_req: Request, res: Response) => {
  try {
    const products = await productAPI.getAllProducts();

    res.status(200).send(products);
  } catch (error) {
    logger.error({ error }, `Get product endpoint failed with error`);
    res.status(400).send(`Error while retrieving data from DB: ${error}`);
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = await productAPI.getProductById(id);

    if (!product) {
      res.status(404).send({ error: `Product with id ${id} was not found` });
      return;
    }

    res.status(200).send(product);
  } catch (error) {
    logger.error({ error, productId: id }, `Get product endpoint failed with error`);
    res.status(400).send({ error: "Bad request" });
  }
};
