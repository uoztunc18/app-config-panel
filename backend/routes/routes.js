import { Router } from "express";
import configRoutes from "./configRoutes.js";
import aiRoutes from "./aiRoutes.js";

const router = Router();

router.use("/ai", aiRoutes);

router.use("/configs", configRoutes);

export default router;
