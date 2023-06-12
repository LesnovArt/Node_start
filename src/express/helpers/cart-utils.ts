import { Cart } from "../data-layer/entities/index.js";

export const getMainCartData = ({
  profile,
  isDeleted,
  ...rest
}: Cart): Pick<Cart, "items" | "id"> => rest;
