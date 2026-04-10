import pool from "../config/db.js";

export const getUserNotifications = async (req, res) => {
  try {
    const userId = req.user.user_id; // From auth middleware
    const [rows] = await pool.query(
      `SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50`,
      [userId]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching notifications:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    await pool.query(
      `UPDATE notifications SET is_read = TRUE WHERE notification_id = ? AND user_id = ?`,
      [id, userId]
    );
    res.json({ success: true, message: "Notification marked as read" });
  } catch (error) {
    console.error("Error marking notification as read:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user.user_id;
    await pool.query(
      `UPDATE notifications SET is_read = TRUE WHERE user_id = ?`,
      [userId]
    );
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.error("Error marking all notifications as read:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
