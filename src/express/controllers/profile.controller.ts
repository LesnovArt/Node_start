import { profiles } from "../mocks/profile";

export const auth = (userId: string, email: string) =>
  profiles.some((profile) => profile.id === userId && profile.email === email);
