import { Response } from "express";

import * as orderAPI from "../services/order.service";

import { Order } from "../model/order";
import { RequestWithReqBody } from "../model/server";

export const createOrder = (req: RequestWithReqBody<{ order: Order }>, res: Response) => {
  const order = req.body.order;

  try {
    const savedOrder = orderAPI.saveOrder(order);

    res.status(200).send(savedOrder);
  } catch (error) {
    res.status(400).send(error);
  }
};
