import { Response, Request } from "express";

import * as productAPI from "../services/product.service";

export const getProducts = (_req: Request, res: Response) => {
  try {
    const products = productAPI.getAllProducts();

    res.status(200).send(products);
  } catch (error) {
    res.status(400).send(`Error while retrieving data from DB: ${error}`);
  }
};

export const getProductById = (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const product = productAPI.getProductById(id);

    if (!product) {
      res.status(404).send({ error: `Product with id ${id} was not found` });
      return;
    }

    res.status(200).send(product);
  } catch (error) {
    res.status(400).send({ error: "Bad request" });
  }
};
