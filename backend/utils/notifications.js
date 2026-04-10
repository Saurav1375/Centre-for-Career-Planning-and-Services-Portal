import pool from '../config/db.js';
import crypto from 'crypto';

/**
 * Inserts a new notification into the database.
 * @param {string} userId - Receiver user UUID
 * @param {string} title - Notification Title
 * @param {string} message - Notification Body
 * @param {string} type - 'system', 'approval', 'follow_up', 'assignment', etc.
 */
export const createNotification = async (userId, title, message, type = 'system') => {
  try {
    const notificationId = crypto.randomUUID();
    const query = `
      INSERT INTO notifications (notification_id, user_id, title, message, type)
      VALUES (?, ?, ?, ?, ?)
    `;
    await pool.query(query, [notificationId, userId, title, message, type]);
  } catch (error) {
    console.error('Error creating notification:', error.message);
  }
};
