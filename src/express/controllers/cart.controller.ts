import { Response } from "express";

import * as cartAPI from "../services/cart.service";

import { RequestWithReqBody, RequestWithAuthQuery } from "../model/server";
import { CartItem } from "../model/cart";

export const getUserCart = (req: RequestWithAuthQuery, res: Response) => {
  const id = req.query.user.id;

  try {
    const userCart = cartAPI.getUserCart(id);

    if (userCart) {
      res.status(200).send(userCart);
      return;
    }

    const newUserCart = cartAPI.createUserCart(id);

    res.status(201).send(newUserCart);
  } catch (error) {
    res.status(400).send({ error: "Bad request" });
  }
};

export const updateUserCart = (
  req: RequestWithReqBody<{ id: string; items: CartItem[] }>,
  res: Response
) => {
  const { id, items } = req.body;

  try {
    const updatedCart = cartAPI.updateUserCart(id, items);

    res.status(200).send(updatedCart);
  } catch (error) {
    res.status(400).send({ error: "Bad request" });
  }
};

export const deleteUserCart = (req: RequestWithAuthQuery, res: Response) => {
  const id = req.query.user.id;

  try {
    const deletedCart = cartAPI.deleteUserCart(id);

    res.status(200).send(deletedCart);
  } catch (error) {
    res.status(400).send({ error: "Bad request" });
  }
};
