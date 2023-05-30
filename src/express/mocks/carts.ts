import { CartFull } from "../model/cart";

export const carts: CartFull[] = [
  {
    id: "cart-id-1",
    userId: "profile-id-1",
    isDeleted: false,
    items: [
      {
        product: {
          id: "2",
          title: "apple",
          description: "fruit",
          price: 3.72,
        },
        count: 2,
      },
    ],
  },
];
