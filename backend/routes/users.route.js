import express from "express";
import { getUsers, approveUser, deleteUser, revokeUser, sendAdminSMSToCallerController, bulkApproveUsers, bulkDeleteUsers, bulkRevokeUsers, updateUserRole } from "../controllers/users.controller.js";
import { protectRoute, trackActivity, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

// Both Admin and Moderator
router.get("/", protectRoute, trackActivity, authorizeRoles("admin", "moderator"), getUsers);
router.patch("/:id/approve", protectRoute, trackActivity, authorizeRoles("admin", "moderator"), approveUser);
router.post("/bulk-approve", protectRoute, trackActivity, authorizeRoles("admin", "moderator"), bulkApproveUsers);
router.post("/:callerId/send-sms", protectRoute, trackActivity, authorizeRoles("admin", "moderator"), sendAdminSMSToCallerController);

// Admin-only access
router.delete("/:id", protectRoute, trackActivity, authorizeRoles("admin"), deleteUser);
router.patch("/:id/revoke", protectRoute, trackActivity, authorizeRoles("admin"), revokeUser);
router.post("/bulk-delete", protectRoute, trackActivity, authorizeRoles("admin"), bulkDeleteUsers);
router.post("/bulk-revoke", protectRoute, trackActivity, authorizeRoles("admin"), bulkRevokeUsers);
router.patch("/:id/role", protectRoute, trackActivity, authorizeRoles("admin"), updateUserRole);

export default router;
