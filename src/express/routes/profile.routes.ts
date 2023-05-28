import express, { Response } from "express";

import * as CartController from "../controllers/cart.controller";
import * as OrderController from "../controllers/order.controller";

import { RequestWithReqBody, RequestWithAuthQuery } from "../model/server";
import { CartItem } from "../model/cart";
import { Order } from "../model/order";

export const profileRouter = express.Router();

profileRouter.get("/cart", (req: RequestWithAuthQuery, res: Response) => {
  CartController.getUserCart(req, res);
});

profileRouter.put(
  "/cart",
  (req: RequestWithReqBody<{ id: string; items: CartItem[] }>, res: Response) => {
    CartController.updateUserCart(req, res);
  }
);

profileRouter.delete("/cart", (req: RequestWithAuthQuery, res: Response) => {
  CartController.deleteUserCart(req, res);
});

profileRouter.post("/cart/checkout", (req: RequestWithReqBody<{ order: Order }>, res: Response) => {
  OrderController.createOrder(req, res);
});
