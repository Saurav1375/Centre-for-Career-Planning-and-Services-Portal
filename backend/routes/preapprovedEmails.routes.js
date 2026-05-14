import express from "express";
import { protectRoute, trackActivity, authorizeRoles } from "../middleware/auth.middleware.js";
import {
  getPreapprovedEmails,
  addPreapprovedEmails,
  deletePreapprovedEmails,
} from "../controllers/preapprovedEmails.controller.js";

const router = express.Router();

// Get all preapproved emails
router.get("/", protectRoute, trackActivity, authorizeRoles("admin"), getPreapprovedEmails);

// Add multiple preapproved emails
router.post("/", protectRoute, trackActivity, authorizeRoles("admin"), addPreapprovedEmails);

// Delete multiple preapproved emails
router.delete("/", protectRoute, trackActivity, authorizeRoles("admin"), deletePreapprovedEmails);

export default router;
