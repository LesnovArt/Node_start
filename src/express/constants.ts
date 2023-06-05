import { getEnv } from "./helpers";

export const BASE_URL = "/api";
export const PORT = 3000;
export const HOST = "localhost";
export const MONGO_URL = getEnv("MONGODB_URL");
