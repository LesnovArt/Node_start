import { Product, Profile } from "../express/data-layer/entities/index.js";
import { products as productsMock, profiles as profilesMock } from "../express/mocks/index.js";
import { DI } from "./defineRepositories.js";

export const seedDatabase = async () => {
  // Using global EntityManager instance methods for context specific actions is disallowed.
  // fork() or allowGlobalContext are possible solutions
  const em = DI.orm.em.fork();
  const products: Product[] = productsMock.map(
    ({ id, title, price, description }) => new Product(id, title, price, description)
  );
  await em.persistAndFlush(products);
  console.log(`Exec seed for products: ${JSON.stringify(products)} `);

  const profiles: Profile[] = profilesMock.map(({ id, email }) => new Profile(id, email));
  await em.persistAndFlush(profiles);
  console.log(`Exec seed for profiles: ${JSON.stringify(profiles)} `);
};
