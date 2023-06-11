import { Response } from "express";

import * as orderAPI from "../services/order.service.js";

import { Order } from "../models/order.js";
import { RequestWithReqBody } from "../models/server.js";

export const createOrder = async (req: RequestWithReqBody<{ order: Order }>, res: Response) => {
  const order = req.body.order;

  try {
    const savedOrder = await orderAPI.saveOrder(order);

    res.status(200).send(savedOrder);
  } catch (error) {
    res.status(400).send(error);
  }
};
