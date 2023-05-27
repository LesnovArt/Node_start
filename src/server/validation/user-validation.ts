import { UpdateUser, UserWithoutHobbies } from "../types/user";

export const isArrayOfType = (arr: unknown[], type: string): boolean =>
  arr.every((item) => typeof item === type);

export const isUserDataValid = (obj: { [key: string]: string | string[] }): obj is UpdateUser => {
  const keys = Object.keys(obj);
  return keys.every((key) => {
    if (key === "hobbies") {
      const value = obj[key];

      return (
        key in obj &&
        (typeof obj[key] === "undefined" ||
          (Array.isArray(value) && isArrayOfType(value, "string")))
      );
    } else {
      return key in obj && typeof obj[key] === "string";
    }
  });
};

export const isEmailExist = (users: UserWithoutHobbies[], user: UpdateUser) =>
  users.some(({ email }) => user.email === email);

export const isHobbyValid = (hobby: unknown) => typeof hobby === "string" && hobby.length > 3;
