import { User, UserWithoutHobbies } from "../types/user";

export const getUserMainData = ({ hobbies, ...rest }: User): UserWithoutHobbies => rest;
export const getUserHobbies = ({ hobbies }: User): string[] => hobbies;
export const generateHATEOASLink = (
  protocol: string,
  host: string,
  port: string,
  pathname: string
): string => `${protocol}://${host}:${port}${pathname}`;
