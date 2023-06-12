import express, { Response, Request } from "express";

import * as ProductController from "../controllers/product.controller.js";

export const productRouter = express.Router();

productRouter.get("/", (req: Request, res: Response) => {
  ProductController.getProducts(req, res);
});

productRouter.get("/:id", (req: Request, res: Response) => {
  ProductController.getProductById(req, res);
});
