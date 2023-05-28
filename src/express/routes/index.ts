import express from "express";

import { profileRouter } from "./profile.routes";
import { productRouter } from "./product.routes";

export const router = express.Router();

router.use(`/profile`, profileRouter);
router.use(`/products`, productRouter);
