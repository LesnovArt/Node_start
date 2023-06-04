import { Response } from "express";

import * as cartAPI from "../services/cart.service";

import { RequestWithReqBody, RequestWithAuthQuery } from "../models/server";
import { CartItem } from "../models/cart";

export const getUserCart = async (req: RequestWithAuthQuery, res: Response) => {
  const id = req.query.user.id;

  try {
    const userCart = await cartAPI.getUserCart(id);

    if (userCart) {
      res.status(200).send(userCart);
      return;
    }

    const newUserCart = await cartAPI.createUserCart(id);

    res.status(201).send(newUserCart);
  } catch (error) {
    res.status(400).send({ error: "Bad request" });
  }
};

export const updateUserCart = async (
  req: RequestWithReqBody<{ id: string; items: CartItem[] }>,
  res: Response
) => {
  const { id, items } = req.body;

  try {
    const updatedCart = await cartAPI.updateUserCart(id, items);

    res.status(200).send(updatedCart);
  } catch (error) {
    res.status(400).send({ error: "Bad request" });
  }
};

export const deleteUserCart = async (req: RequestWithAuthQuery, res: Response) => {
  const id = req.query.user.id;

  try {
    const deletedCart = await cartAPI.deleteUserCart(id);

    res.status(200).send(deletedCart);
  } catch (error) {
    res.status(400).send({ error: "Bad request" });
  }
};
