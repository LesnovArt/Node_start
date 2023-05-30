import { Cart, CartFull } from "../model/cart";

export const getMainCartData = ({ userId, isDeleted, ...rest }: CartFull): Cart => rest;
