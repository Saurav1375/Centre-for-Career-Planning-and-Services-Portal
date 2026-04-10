import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUserNotifications, markAsRead, markAllAsRead } from "../controllers/notifications.controller.js";

const router = express.Router();

router.get("/", protectRoute, getUserNotifications);
router.put("/read-all", protectRoute, markAllAsRead);
router.put("/:id/read", protectRoute, markAsRead);

export default router;
