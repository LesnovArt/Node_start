import { Cart, CartFull } from "../models/cart";

export const getMainCartData = ({ userId, isDeleted, ...rest }: CartFull): Cart => rest;
