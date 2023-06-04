import { CartModel } from "../data-layer/models";
import { generateStringId, getMainCartData } from "../helpers";

import { CartFull, Cart, CartItem } from "../models";

export const getFullUserCart = async (userId: string): Promise<CartFull | null> =>
  CartModel.findOne({ userId })
    .lean()
    .exec()
    .then((cart) => cart)
    .catch((error) => {
      console.warn(`Error while request to DB: ${error}`);
      return null;
    });

export const getUserCart = async (userId: string): Promise<Cart | null> => {
  const cart = await getFullUserCart(userId);
  if (!cart || (cart && cart.isDeleted)) {
    return null;
  }

  return getMainCartData(cart);
};

export const createUserCart = async (userId: string): Promise<Cart | null> => {
  const cartId = generateStringId();

  const newCart = {
    id: cartId,
    userId,
    items: [],
    isDeleted: false,
  };

  try {
    await CartModel.create(newCart);

    return getMainCartData(newCart);
  } catch (error) {
    console.warn(`Error while request to DB: ${error}`);

    return null;
  }
};

interface MakeUpdateProps {
  userId: string;
  cart: CartFull | null;
  cartDetails?: Partial<CartFull>;
  cartItems?: CartItem[];
}

const makeUpdate = async ({
  userId,
  cart,
  cartDetails,
  cartItems,
}: MakeUpdateProps): Promise<Cart | null> => {
  try {
    if (!cart || (cart && cart.isDeleted)) {
      throw new Error(`User do not have cart with id: ${userId}`);
    }
    if (!cartItems?.length || !cartDetails) {
      throw new Error(`Empty data for update cart with id: ${userId}`);
    }

    const updatedCart = await CartModel.findOneAndUpdate(
      { userId },
      { ...cart, items: [...cart.items, ...(cartItems || [])], ...cartDetails },
      { new: true }
    );

    if (!updatedCart) {
      throw new Error(`Update cart with id: ${userId} failed`);
    }

    return getMainCartData(updatedCart);
  } catch (error) {
    return null;
  }
};
export const updateUserCart = async (
  userId: string,
  cartItems: CartItem[]
): Promise<Cart | null> => {
  const cart = await getFullUserCart(userId);
  return makeUpdate({ userId, cart, cartItems });
};

export const deleteUserCart = async (userId: string): Promise<Cart | null> => {
  const cart = await getFullUserCart(userId);
  return makeUpdate({ userId, cartDetails: { isDeleted: true }, cart });
};
