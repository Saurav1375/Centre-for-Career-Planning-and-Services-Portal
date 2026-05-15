import express from "express";
import { protectRoute, trackActivity } from "../middleware/auth.middleware.js";
import { getUserNotifications, markAsRead, markAllAsRead } from "../controllers/notifications.controller.js";

const router = express.Router();

router.get("/", protectRoute, trackActivity, getUserNotifications);
router.put("/read-all", protectRoute, trackActivity, markAllAsRead);
router.put("/:id/read", protectRoute, trackActivity, markAsRead);

export default router;
