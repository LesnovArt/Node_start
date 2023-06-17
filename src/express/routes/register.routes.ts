import express, { Request, Response } from "express";

import * as ProfileController from "../controllers/profile.controller.js";

export const registerRouter = express.Router();

registerRouter.post("/register", async (req: Request, res: Response) =>
  ProfileController.registerProfile(req, res)
);
