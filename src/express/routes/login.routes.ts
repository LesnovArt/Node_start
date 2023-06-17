import express, { Request, Response } from "express";

import * as ProfileController from "../controllers/profile.controller.js";

export const loginRouter = express.Router();

loginRouter.post("/login", async (req: Request, res: Response) =>
  ProfileController.loginProfile(req, res)
);
