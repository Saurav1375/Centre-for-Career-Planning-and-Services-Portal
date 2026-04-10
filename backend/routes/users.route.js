import express from "express";
import { getUsers, approveUser, deleteUser, revokeUser, sendAdminSMSToCallerController, bulkApproveUsers, bulkDeleteUsers, bulkRevokeUsers, updateUserRole } from "../controllers/users.controller.js";
import { protectRoute, authorizeRoles } from "../middleware/auth.middleware.js";

const router = express.Router();

// Both Admin and Moderator
router.get("/", protectRoute, authorizeRoles("admin", "moderator"), getUsers);
router.patch("/:id/approve", protectRoute, authorizeRoles("admin", "moderator"), approveUser);
router.post("/bulk-approve", protectRoute, authorizeRoles("admin", "moderator"), bulkApproveUsers);
router.post("/:callerId/send-sms", protectRoute, authorizeRoles("admin", "moderator"), sendAdminSMSToCallerController);

// Admin-only access
router.delete("/:id", protectRoute, authorizeRoles("admin"), deleteUser);
router.patch("/:id/revoke", protectRoute, authorizeRoles("admin"), revokeUser);
router.post("/bulk-delete", protectRoute, authorizeRoles("admin"), bulkDeleteUsers);
router.post("/bulk-revoke", protectRoute, authorizeRoles("admin"), bulkRevokeUsers);
router.patch("/:id/role", protectRoute, authorizeRoles("admin"), updateUserRole);

export default router;
