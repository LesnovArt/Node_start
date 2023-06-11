import { DI } from "../../microORM/index.js";
import { Profile } from "../data-layer/entities/profile.js";

export const auth = async (userId: string, email: string): Promise<Profile | null> => {
  try {
    const entityManager = DI.profileRepository.getEntityManager();
    const loggedInProfile = await entityManager.findOne(Profile, { id: userId, email });

    if (!loggedInProfile) {
      return null;
    }
    return loggedInProfile;
  } catch (error) {
    return null;
  }
};
