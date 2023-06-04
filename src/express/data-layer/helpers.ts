import { CartModel, OrderModel, ProfileModel, ProductModel } from "./models";
import { carts, orders, products, profiles } from "./../mocks";
import { applyMigrations } from "./migrations/applyMigrations";

export const migrateDataToDB = async (): Promise<void> => {
  try {
    console.log("Migrating");

    const profilesData = await ProfileModel.create(profiles);
    console.log("Migrating ProfileModel", profilesData);

    const productsData = await ProductModel.create(products);
    console.log("Migrating ProductModel", productsData);

    const cartsData = await CartModel.create(carts);
    console.log("Migrating CartModel", cartsData);

    const ordersData = await OrderModel.create(orders);
    console.log("Migrating OrderModel", ordersData);
    await applyMigrations();
  } catch (error) {
    console.log("Error", error);
  }
};
