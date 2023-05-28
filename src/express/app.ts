import express, { NextFunction, Request, Response } from "express";

import bodyParser from "body-parser";
import { router } from "./routes";
import { BASE_URL, HOST, PORT } from "./constants";
import { authMiddleware } from "./middlewares/auth";

const app = express();

app.use(bodyParser.json());
app.use(authMiddleware);
app.use(BASE_URL, router);
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(error.stack);
  res.status(500).send("Something broke!");

  next(error);
});

app.listen(PORT, HOST, () => {
  console.log(`Server is listening on http://${HOST}:${PORT}`);
});
