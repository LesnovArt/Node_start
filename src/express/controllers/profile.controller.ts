import { Response, Request } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import * as profileAPI from "../services/profile.service.js";
import { Role } from "../models/index.js";
import { EXPIRE_JWT } from "../constants.js";
import { logAuth } from "../debug/index.js";

export const loginProfile = async (req: Request, res: Response) => {
  logAuth(`Login was started`);

  const { email, password } = req.body;

  if (!(email && password)) {
    res.status(400).send("All input is required");
  }
  try {
    const profile = await profileAPI.getProfile(email);

    if (profile && (await bcrypt.compare(password, profile.password))) {
      const token = jwt.sign(
        { id: profile.id, email, role: profile.role },
        process.env.TOKEN_KEY!,
        {
          expiresIn: EXPIRE_JWT,
        }
      );

      res.status(200).json({
        token,
        id: profile.id,
        email,
        role: profile.role,
      });
      return;
    }

    res.status(400).send("Invalid Credentials");
  } catch (error) {
    logAuth(`Login endpoint access failed with error: ${error}`);
    res.status(400).send(`Error while retrieving data from DB: ${error}`);
  }
};

export const registerProfile = async (req: Request, res: Response) => {
  logAuth(`Registration was started`);
  const { isAdmin, email, password } = req.body;
  if (!(email && password)) {
    res.status(400).send("All inputs are required");
    return;
  }

  try {
    const profileData = await profileAPI.getProfile(email);

    const encryptedPassword = await bcrypt.hash(password, 10);

    if (profileData) {
      res
        .status(409)
        .send({ error: "Profile is already existed. Change email or try to login with this one" });
    }

    await profileAPI.createProfile({
      email: email.toLowerCase(),
      password: encryptedPassword,
      role: isAdmin === "true" ? Role.ADMIN : Role.CUSTOMER,
    });

    res.status(201).send("User successfully registered");
  } catch (error) {
    logAuth(`Register endpoint access failed with error: ${error}`);
    res.status(400).send({ error: "Bad request" });
  }
};
