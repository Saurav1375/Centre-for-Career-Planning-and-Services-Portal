import express from "express";
import { protectRoute , trackActivity , authorizeRoles , authorizeUpdateLog , createLogAuthorization } from "../middleware/auth.middleware.js";
import { createCallLog, getAllCallLogs, getCallLogById, updateCallLog, deleteCallLog } from "../controllers/callLog.controller.js";

const router = express.Router();

// Routes
router.post("/", protectRoute, trackActivity, createLogAuthorization, createCallLog);       // Create new log
router.get("/", protectRoute, trackActivity, getAllCallLogs);       // Get all logs
router.get("/:id", protectRoute, trackActivity, getCallLogById);    // Get single log
router.put("/:id", protectRoute, trackActivity, authorizeUpdateLog, updateCallLog);     // Update log
router.delete("/:id", protectRoute, trackActivity, authorizeRoles("admin"), deleteCallLog);  // Delete log

export default router;
