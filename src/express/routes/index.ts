import express from "express";

import { profileRouter } from "./profile.routes.js";
import { productRouter } from "./product.routes.js";
import { isCustomer } from "../middlewares/isCustomer.js";
export { healthRouter } from "./health.routes.js";
export { loginRouter } from "./login.routes.js";
export { registerRouter } from "./register.routes.js";

export const router = express.Router();

router.use(`/profile`, isCustomer, profileRouter);
router.use(`/products`, productRouter);
