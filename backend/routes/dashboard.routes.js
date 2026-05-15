import express from "express";
import { protectRoute, trackActivity, authorizeRoles } from "../middleware/auth.middleware.js";
import { getCallerDashboard } from "../controllers/dashboard.controller.js";
import { getAdminDashboard } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/", protectRoute, trackActivity, authorizeRoles("admin", "caller"), getCallerDashboard);

router.get("/admin", protectRoute, trackActivity, authorizeRoles("admin"), getAdminDashboard);

export default router;
