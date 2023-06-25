import { configEnv } from "../../../configENV.js";
import debug from "debug";

export { logger } from "./createLogger.js";

configEnv();
const args = process.argv.slice(2);

args.forEach((namespace) => {
  debug.enable(`${namespace}`);
});

export const logAuth = debug(process.env.DEBUG_NS_AUTH as string);
export const logConnection = debug(process.env.DEBUG_NS_CONNECTION as string);
