import { DI } from "../../microORM/index.js";
import { CartItem, Order } from "../data-layer/entities/index.js";
import { Order as OrderModel } from "../models/order.js";

export const getOrder = async (orderId: string): Promise<Order | null> => {
  const orderRepository = DI.orderRepository.getEntityManager();
  return orderRepository.findOneOrFail(Order, { id: orderId });
};

export const saveOrder = async (order: OrderModel): Promise<OrderModel | null> => {
  try {
    const orderRepository = DI.orderRepository.getEntityManager();
    const cartItemRepository = DI.cartItemRepository.getEntityManager();
    const existingOrder = await orderRepository.findOne(Order, { id: order.id });

    if (existingOrder) {
      throw new Error("Order has already been created");
    }
    const { payment, delivery, items, ...rest } = order;
    const itemsCollection = await Promise.all(
      items.map(({ product }) => cartItemRepository.findOneOrFail(CartItem, { id: product.id }))
    );

    const newOrder = {
      ...payment,
      ...delivery,
      ...rest,
      items: itemsCollection,
    };
    await orderRepository.persistAndFlush(newOrder);
    return order;
  } catch (error) {
    console.warn(`Error while creating order in DB: ${error}`);
    return null;
  }
};
