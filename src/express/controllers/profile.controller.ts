import { ProfileRepository } from "../data-layer/repositories";
import { Profile } from "../models";

export const auth = async (userId: string, email: string): Promise<Profile | null> => {
  try {
    const loggedInProfile = await ProfileRepository.findOne({ id: userId, email });

    if (!loggedInProfile) {
      return null;
    }
    return loggedInProfile;
  } catch (error) {
    return null;
  }
};
