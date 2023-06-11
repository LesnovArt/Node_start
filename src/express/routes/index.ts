import express from "express";

import { profileRouter } from "./profile.routes.js";
import { productRouter } from "./product.routes.js";

export const router = express.Router();

router.use(`/profile`, profileRouter);
router.use(`/products`, productRouter);
