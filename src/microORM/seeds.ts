import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { MikroORM } from "@mikro-orm/core";
import bcrypt from "bcryptjs";

import { Product, Profile } from "../express/data-layer/entities/index.js";
import { products as productsMock, profiles as profilesMock } from "../express/mocks/index.js";
import { DI, defineRepositories } from "./defineRepositories.js";
import { options } from "../../orm.config.js";

export const seedDatabase = async () => {
  DI.orm = await MikroORM.init<PostgreSqlDriver>({ ...options, allowGlobalContext: true });
  await defineRepositories();
  // Using global EntityManager instance methods for context specific actions is disallowed.
  // fork() or allowGlobalContext are possible solutions
  const em = DI.orm.em.fork();
  for (const { id, title, price, description } of productsMock) {
    const existedProduct = await DI.productRepository.findOne({ id });

    if (existedProduct) {
      existedProduct.title = title;
      existedProduct.price = price;
      existedProduct.description = description;
    } else {
      const newProduct = new Product(id, title, price, description);

      em.persist(newProduct);
    }

    await em.flush();
    console.log(`Product ${id} was migrated`);
  }

  console.log(`Exec seed for products: ${JSON.stringify(productsMock)} `);

  for (const { id, email, password, role } of profilesMock) {
    const existedProfile = await DI.profileRepository.findOne({ id });

    if (existedProfile) {
      existedProfile.email = email;
      existedProfile.password = await bcrypt.hash(password, 10);
      existedProfile.role = role;
    } else {
      const newProfile = new Profile(id, email, password, role);

      em.persist(newProfile);
    }

    await em.flush();
    console.log(`Profile ${id} was migrated`);
  }

  console.log(`Exec seed for profiles: ${JSON.stringify(profilesMock)} `);

  await DI.orm.close();
  console.log("Connection was closed");
};

// can be started only with `yarn seed:db` command after `yarn build`
if (import.meta.url) {
  seedDatabase();
}
