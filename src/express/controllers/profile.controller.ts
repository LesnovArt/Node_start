import { ProfileModel } from "../data-layer/models";
import { Profile } from "../models";

export const auth = async (userId: string, email: string): Promise<Profile | null> => {
  try {
    const loggedInProfile = await ProfileModel.findOne({ id: userId, email });

    if (!loggedInProfile) {
      return null;
    }
    return loggedInProfile;
  } catch (error) {
    return null;
  }
};
