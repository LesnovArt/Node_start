import { DI } from "../../microORM/index.js";
import { Profile as ProfileModel } from "../models/index.js";
import { Profile } from "../data-layer/entities/profile.js";
import { generateStringId } from "../helpers/index.js";

export const getProfile = async (email: string): Promise<Profile | null> => {
  const profile = await DI.profileRepository.findOne({ email });

  return profile;
};

export const createProfile = async ({
  email,
  password,
  role,
}: Omit<ProfileModel, "id">): Promise<Profile | null> => {
  const profileId = generateStringId();
  const profileRepository = DI.profileRepository.getEntityManager();
  const newProfile = new Profile(profileId, email, password, role);

  await profileRepository.persistAndFlush(newProfile);

  return newProfile;
};
