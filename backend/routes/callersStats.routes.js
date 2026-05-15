import express from "express";
import { protectRoute, trackActivity, authorizeRoles } from "../middleware/auth.middleware.js";
import { getAllCallersStats } from "../controllers/callersStats.controller.js";

const router = express.Router();

// Only admin can see all caller stats
router.get("/", protectRoute, trackActivity, authorizeRoles("admin"), getAllCallersStats);

export default router;
