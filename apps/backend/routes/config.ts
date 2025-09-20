
import { Router } from "express";
import { ConfigController } from "../controllers/configController";

const router = Router();

// Configuration routes
router.get("/", ConfigController.getConfig);
router.get("/health", ConfigController.healthCheck);

export default router;
