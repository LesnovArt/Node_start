export interface User {
  id: number;
  name: string;
  email: string;
  hobbies: string[];
}

export type UserWithoutHobbies = Omit<User, "hobbies">;
export type UpdateUser = Omit<User, "id">;
