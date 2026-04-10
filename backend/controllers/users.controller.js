import Users from "../models/users.model.js";
import { createNotification } from "../utils/notifications.js";
import pool from "../config/db.js"

// Get users (approved, pending, all)
export const getUsers = async (req, res) => {
  try {
    const { status, role } = req.query;
    const users = await Users.getUsers({ status, role });
    res.json({ success: true, data: users });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Approve user
export const approveUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Users.approveUser(id);

    if (!updated) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error approving user:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Revoke user
export const revokeUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Users.revokeUser(id);

    if (!updated) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error("Error revoking user:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Users.deleteUser(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "User deleted", data: deleted });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update user role
export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['admin', 'moderator', 'caller'].includes(role)) {
      return res.status(400).json({ success: false, message: "Invalid role specified" });
    }

    const updated = await Users.updateRole(id, role);

    if (!updated) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, message: "Role updated", data: updated });
  } catch (error) {
    console.error("Error updating user role:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Bulk Approve Users
export const bulkApproveUsers = async (req, res) => {
  try {
    const { userIds } = req.body;
    if (!userIds || userIds.length === 0) {
      return res.status(400).json({ success: false, message: "No users provided" });
    }
    const approvedIds = await Users.bulkApproveUsers(userIds);
    res.json({ success: true, message: "Users approved successfully", data: approvedIds });
  } catch (error) {
    console.error("Error bulk approving users:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Bulk Delete Users
export const bulkDeleteUsers = async (req, res) => {
  try {
    const { userIds } = req.body;
    if (!userIds || userIds.length === 0) {
      return res.status(400).json({ success: false, message: "No users provided" });
    }
    const deletedIds = await Users.bulkDeleteUsers(userIds);
    res.json({ success: true, message: "Users deleted successfully", data: deletedIds });
  } catch (error) {
    console.error("Error bulk deleting users:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Bulk Revoke Users
export const bulkRevokeUsers = async (req, res) => {
  try {
    const { userIds } = req.body;
    if (!userIds || userIds.length === 0) {
      return res.status(400).json({ success: false, message: "No users provided" });
    }
    const revokedIds = await Users.bulkRevokeUsers(userIds);
    res.json({ success: true, message: "Users revoked successfully", data: revokedIds });
  } catch (error) {
    console.error("Error bulk revoking users:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



export const sendAdminSMSToCallerController = async (req, res) => {
  try {
    const { callerId } = req.params;
    const { adminMessage } = req.body;

    if (!adminMessage) {
      return res.status(400).json({ error: "Admin message is required" });
    }

    // Query caller from MariaDB
    const [rows] = await pool.query(
      "SELECT user_id, full_name, email FROM users WHERE user_id = ?",
      [callerId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Caller not found" });
    }

    const caller = rows[0];

    // Create Notification
    await createNotification(
      caller.user_id,
      "Message from Admin",
      adminMessage,
      "system"
    );

    res.status(200).json({ message: "Admin message sent successfully" });
  } catch (error) {
    console.error("Error in sendAdminSMSToCallerController:", error.message);
    res.status(500).json({ error: "Failed to send Admin message" });
  }
};