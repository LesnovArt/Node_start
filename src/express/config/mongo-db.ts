import mongoose from "mongoose";
import { migrateDataToDB } from "../data-layer/helpers";

export const connectToDB = async (url: string): Promise<void> => {
  try {
    await mongoose.connect(url);
    console.log(`Connected to ${url}`);
    await migrateDataToDB();
    console.log("Custom prefill was successfully finished");
  } catch (error) {
    console.error(`Failed to connect to ${url}:`, error);
  }
};
