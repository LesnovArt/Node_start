import { Schema, Document, model } from "mongoose";
import { Profile } from "../../models";

export const profileSchema = new Schema({
  id: { type: String, required: true },
  email: { type: String, required: true },
  cartId: { type: String },
});

export const ProfileRepository = model<Profile & Document>("Profile", profileSchema);
