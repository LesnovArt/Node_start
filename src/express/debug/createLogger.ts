import bunyan from "bunyan";
import { customSerializers } from "./bunyanSerializers.js";

import fs from "fs";

const getLogger = () => {
  const logFilePath = "./src/express/debug/requests.log";

  if (!fs.existsSync(logFilePath)) {
    fs.writeFileSync(logFilePath, "");
  }

  const fileStream = fs.createWriteStream(logFilePath, { flags: "a" });
  return bunyan.createLogger({
    name: "express",
    level: process.env.NODE_ENV === "production" ? bunyan.FATAL + 1 : "trace",
    path: logFilePath,
    streams: [{ stream: process.stdout }, { stream: fileStream }],
    serializers: customSerializers,
  });
};

export const logger = getLogger();
