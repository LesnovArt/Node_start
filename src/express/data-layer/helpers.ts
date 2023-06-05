import {
  CartRepository,
  OrderRepository,
  ProfileRepository,
  ProductRepository,
} from "./repositories";
import { carts, orders, products, profiles } from "./../mocks";
import { applyMigrations } from "./migrations/applyMigrations";

export const migrateDataToDB = async (): Promise<void> => {
  try {
    console.log("Migrating");

    const profilesData = await ProfileRepository.create(profiles);
    console.log("Migrating ProfileModel", profilesData);

    const productsData = await ProductRepository.create(products);
    console.log("Migrating ProductModel", productsData);

    const cartsData = await CartRepository.create(carts);
    console.log("Migrating CartModel", cartsData);

    const ordersData = await OrderRepository.create(orders);
    console.log("Migrating OrderModel", ordersData);
    await applyMigrations();
  } catch (error) {
    console.log("Error", error);
  }
};
