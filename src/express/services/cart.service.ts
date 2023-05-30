import { generateStringId, getMainCartData } from "../helpers";
import { carts } from "../mocks/carts";

import { CartFull, Cart, CartItem } from "../model/cart";

export const getFullUserCart = (userId: string): CartFull | undefined =>
  carts.find(({ id }) => id === userId);

export const getUserCart = (userId: string): Cart | undefined => {
  const cart = getFullUserCart(userId);
  if (!cart || (cart && cart.isDeleted)) {
    return;
  }

  return getMainCartData(cart);
};

export const createUserCart = (userId: string): CartFull => {
  const cartId = generateStringId();

  const newCart = {
    id: cartId,
    userId,
    items: [],
    isDeleted: false,
  };
  carts.push(newCart);

  return newCart;
};

export const updateUserCart = (userId: string, cartItems: CartItem[]): Cart => {
  const cartIndex = carts.findIndex(({ id }) => id === userId);
  const cart = getFullUserCart(userId);

  if (!cart || (cart && cart.isDeleted)) {
    throw new Error(`User do not have cart with id: ${userId}`);
  }

  const updatedCart = { ...cart, ...cartItems };
  carts.splice(cartIndex, 1, updatedCart);

  return getMainCartData(updatedCart);
};

export const deleteUserCart = (userId: string): Cart => {
  const cartIndex = carts.findIndex(({ id }) => id === userId);
  const cart = getFullUserCart(userId);

  if (!cart || (cart && cart.isDeleted)) {
    throw new Error(`User do not have cart with id: ${userId}`);
  }

  const updatedCart = { ...cart, isDeleted: true };
  carts.splice(cartIndex, 1, updatedCart);

  return getMainCartData(cart);
};
