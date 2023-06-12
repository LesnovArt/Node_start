import http from "http";
import { EntityManager, EntityRepository, MikroORM } from "@mikro-orm/core";

import { Cart, CartItem, Order, Product, Profile } from "../express/data-layer/entities/index.js";

interface DI_Interface {
  server: http.Server;
  orm: MikroORM;
  em: EntityManager;
  profileRepository: EntityRepository<Profile>;
  cartRepository: EntityRepository<Cart>;
  cartItemRepository: EntityRepository<CartItem>;
  productRepository: EntityRepository<Product>;
  orderRepository: EntityRepository<Order>;
}

export const DI = {} as DI_Interface;

export const defineRepositories = () => {
  DI.em = DI.orm.em;
  DI.profileRepository = DI.orm.em.getRepository(Profile);
  console.log(`Profile repository`);
  DI.cartRepository = DI.orm.em.getRepository(Cart);
  console.log(`Cart repository`);
  DI.cartItemRepository = DI.orm.em.getRepository(CartItem);
  console.log(`CartItem repository`);
  DI.productRepository = DI.orm.em.getRepository(Product);
  console.log(`Product repository`);
  DI.orderRepository = DI.orm.em.getRepository(Order);
  console.log(`Order repository`);
};
