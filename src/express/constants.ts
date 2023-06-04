export const BASE_URL = "/api";
export const PORT = 3000;
export const HOST = "localhost";

type ENV_NAMES = "MONGODB_URL";

export const getEnv = (envName: ENV_NAMES): string => {
  const env = process.env[envName];

  if (typeof env === "string") {
    return env;
  }

  return "";
};
