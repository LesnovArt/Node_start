import bunyan from "bunyan";

export const logger = bunyan.createLogger({
  name: "express",
  level: process.env.NODE_ENV === "production" ? bunyan.FATAL + 1 : "info",
  streams: [{ stream: process.stdout }],
});
