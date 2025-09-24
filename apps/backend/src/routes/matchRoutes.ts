import { Router } from "express";
import { getMatches, createMatch } from "@bakcontrollers/matchController";

const router = Router();

router.get("/", getMatches);
router.post("/", createMatch);

export default router;