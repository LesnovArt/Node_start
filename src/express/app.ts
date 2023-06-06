import express, { NextFunction, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

import { router } from "./routes";
import { BASE_URL, PORT, HOST, MONGO_URL } from "./constants";
import { authMiddleware } from "./middlewares/auth";
import { connectToDB } from "./config";

const app = express();

app.use(bodyParser.json());
app.use(authMiddleware);
app.use(BASE_URL, router);
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(error.stack);
  res.status(500).send("Something broke!");

  next(error);
});

const startServer = async () => {
  try {
    await connectToDB(MONGO_URL);
    app.listen(PORT, HOST, () => {
      console.log(`Server is listening on http://${HOST}:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  }
};

startServer();
