import { EntityRepository } from "@mikro-orm/core";

import { Cart, Profile, Product } from "../data-layer/entities/index.js";
import { generateStringId, getMainCartData } from "../helpers/index.js";
import { CartFull, CartItem as CartItemModel } from "../models/index.js";
import { DI } from "../../microORM/index.js";

export const getFullUserCart = async (userId: string): Promise<Cart | null> => {
  const cartRepository: EntityRepository<Cart> = DI.cartRepository;
  return cartRepository.findOne({ id: userId });
};

export const getUserCart = async (userId: string): Promise<Cart | null> => {
  const cart = await DI.cartRepository.findOne({ profile: userId });

  if (!cart || (cart && cart.isDeleted)) {
    return null;
  }

  return cart;
};

export const createUserCart = async (userId: string): Promise<Cart | null> => {
  const cartId = generateStringId();
  const profileRepository = DI.profileRepository.getEntityManager();
  const profile = await profileRepository.findOneOrFail(Profile, { id: userId });

  const newCart: Cart = new Cart(cartId, profile, false);

  try {
    const cartRepository = DI.cartRepository.getEntityManager();
    await cartRepository.persistAndFlush(newCart);

    return newCart;
  } catch (error) {
    console.warn(`Error while creating cart in DB: ${error}`);

    return null;
  }
};

interface MakeUpdateProps {
  userId: string;
  cart: Cart | null;
  cartDetails?: Partial<CartFull>;
  cartItems?: CartItemModel[];
}

const makeUpdate = async ({
  userId,
  cart,
  cartDetails,
  cartItems,
}: MakeUpdateProps): Promise<Pick<Cart, "items" | "id"> | null> => {
  try {
    if (!cart || (cart && cart.isDeleted)) {
      throw new Error(`User does not have a cart with id: ${userId}`);
    }
    if (!cartItems?.length || !cartDetails) {
      throw new Error(`Empty data for updating cart with id: ${userId}`);
    }

    const cartRepository = DI.cartRepository.getEntityManager();

    cart.isDeleted = cartDetails.isDeleted ?? cart.isDeleted;
    if (cart.items?.length) {
      cart.items.removeAll();
    }
    cartItems.forEach(async (item) => {
      const cartItemId = generateStringId();
      const productRepository = DI.productRepository.getEntityManager();
      const product = await productRepository.findOneOrFail(Product, { id: item.product.id });

      cart.items.add({ ...item, product, id: cartItemId, cart });
    });

    await cartRepository.persistAndFlush(cart);

    return getMainCartData(cart);
  } catch (error) {
    return null;
  }
};

export const updateUserCart = async (
  userId: string,
  cartItems: CartItemModel[]
): Promise<Pick<Cart, "items" | "id"> | null> => {
  const cart = await getFullUserCart(userId);

  return makeUpdate({ userId, cart, cartItems });
};

export const deleteUserCart = async (
  userId: string
): Promise<Pick<Cart, "items" | "id"> | null> => {
  const cart = await getFullUserCart(userId);
  return makeUpdate({ userId, cartDetails: { isDeleted: true }, cart });
};
