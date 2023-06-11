import { Entity, PrimaryKey, Property } from "@mikro-orm/core";

@Entity()
export class Product {
  @PrimaryKey()
  id!: string;

  @Property()
  title!: string;

  @Property()
  price!: number;

  @Property()
  description?: string;

  constructor(id: string, title: string, price: number, description?: string) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.description = description;
  }

  copyProduct(): Product {
    return new Product(this.id, this.title, this.price, this.description);
  }
}
