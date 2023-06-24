import express from "express";

import { profileRouter } from "./profile.routes.js";
import { productRouter } from "./product.routes.js";
import { isCustomer } from "../middlewares/isCustomer.js";

export const router = express.Router();

router.use(`/profile`, isCustomer, profileRouter);
router.use(`/products`, productRouter);
