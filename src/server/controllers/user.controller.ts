import { users } from "../mocks/user";
import { UpdateUser, User } from "../types/user";

export const userController = {
  getAllUsers(): User[] {
    return users;
  },
  getUserById(userId?: number): User | undefined {
    return users.find(({ id }) => id === userId);
  },
  updateUserById(userId: number, updateData: Partial<UpdateUser>): User | undefined {
    const foundUser = users.find(({ id }) => id === userId);

    if (!foundUser) {
      return;
    }
    const updatedIndex = users.findIndex(({ id }) => id === userId);

    const updatedUser = { ...foundUser, ...updateData };

    users.splice(updatedIndex, 1, updatedUser)[0];

    return updatedUser;
  },
  updateUserHobbyById(userId: number, newHobby: string): User | undefined {
    const foundUser = users.find(({ id }) => id === userId);

    if (!foundUser) {
      return;
    }

    foundUser.hobbies.push(newHobby);

    return foundUser;
  },
  deleteUserHobbyById(userId: number, hobbyToRemove: string): string | undefined {
    const foundUser = users.find(({ id }) => id === userId);
    const indexToRemove = foundUser?.hobbies.findIndex((hobby) => hobby === hobbyToRemove) ?? -1;

    if (!foundUser || indexToRemove === -1) {
      return;
    }

    const removedHobby = foundUser.hobbies.splice(indexToRemove, 1);

    return removedHobby[0];
  },
  createUser(user: UpdateUser): User {
    const id = Math.floor(Math.random() * 42 + 48);
    const newUser = {
      id,
      ...user,
    };
    users.push(newUser);

    return newUser;
  },
  deleteUser(userId: number): User | undefined {
    const deletedIndex = users.findIndex(({ id }) => id === userId);

    if (deletedIndex === -1) {
      return;
    }

    return users.splice(deletedIndex, 1)[0];
  },
};
