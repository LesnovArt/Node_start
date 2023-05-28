import { orders } from "../mocks/order";

import { Order } from "../model/order";

export const getOrder = (orderId: string): Order | undefined =>
  orders.find(({ id }) => orderId === id);

export const saveOrder = (order: Order): Order => {
  const existingOrder = getOrder(order.id);

  if (existingOrder) {
    throw new Error("Order has been already created");
  }

  orders.push(order);

  return order;
};
