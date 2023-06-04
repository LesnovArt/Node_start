import { OrderModel } from "../data-layer/models";
import { orders } from "../mocks/order";

import { Order } from "../models/order";

export const getOrder = (orderId: string): Order | undefined =>
  orders.find(({ id }) => orderId === id);

export const saveOrder = async (order: Order): Promise<Order | null> => {
  try {
    const existingOrder = await OrderModel.findById(order.id).lean().exec();

    if (existingOrder) {
      throw new Error("Order has been already created");
    }

    await OrderModel.create();
    return order;
  } catch (error) {
    console.warn(`Error while creating order in DB: ${error}`);

    return null;
  }
};
