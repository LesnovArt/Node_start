import { Response, NextFunction } from "express";

import * as profileAPI from "../services/profile.service.js";
import { RequestWithAuthQuery, Role } from "../models/index.js";

export const isCustomer = async (req: RequestWithAuthQuery, res: Response, next: NextFunction) => {
  try {
    const email = req.query?.user?.email;

    if (!email) {
      res
        .status(400)
        .send("Please pass registration before to continue, no user email was provided");
    }
    const profile = await profileAPI.getProfile(email);

    if (profile?.role !== Role.CUSTOMER) {
      res
        .status(400)
        .send(
          "Your do not have role to access this resource. Contact administrators to resolve it"
        );
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
};
