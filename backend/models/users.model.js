import pool from "../config/db.js";

const Users = {
  // Get users with optional filters
  async getUsers({ status, role }) {
    let query = `SELECT user_id, full_name, email, role, branch, is_approved, is_verified, created_at, last_active_at
                 FROM users WHERE 1=1`;
    const values = [];

    if (status === "approved") {
      query += ` AND is_approved = true`;
    } else if (status === "pending") {
      query += ` AND is_approved = false`;
    }

    if (role) {
      query += ` AND role = ?`;
      values.push(role);
    }

    query += ` ORDER BY created_at DESC`;

    const [rows] = await pool.query(query, values);
    return rows;
  },

  // Approve user
  async approveUser(user_id) {
    const query = `
      UPDATE users 
      SET is_approved = true, updated_at = NOW() 
      WHERE user_id = ?
    `;
    await pool.query(query, [user_id]);
    const [rows] = await pool.query(`SELECT user_id, full_name, email, is_approved FROM users WHERE user_id = ?`, [user_id]);
    return rows[0];
  },

  // Revoke user
  async revokeUser(user_id) {
    const query = `
      UPDATE users 
      SET is_approved = false, updated_at = NOW() 
      WHERE user_id = ?
    `;
    await pool.query(query, [user_id]);
    const [rows] = await pool.query(`SELECT user_id, full_name, email, is_approved FROM users WHERE user_id = ?`, [user_id]);
    return rows[0];
  },

  // Update role
  async updateRole(user_id, role) {
    const query = `
      UPDATE users
      SET role = ?, updated_at = NOW()
      WHERE user_id = ?
    `;
    await pool.query(query, [role, user_id]);
    const [rows] = await pool.query(`SELECT user_id, full_name, role FROM users WHERE user_id = ?`, [user_id]);
    return rows[0];
  },

  // Delete (reject) user
  async deleteUser(user_id) {
    const [rows] = await pool.query(`SELECT user_id FROM users WHERE user_id = ?`, [user_id]);
    if(rows.length === 0) return null;
    await pool.query(`DELETE FROM users WHERE user_id = ?`, [user_id]);
    return rows[0];
  },

  async bulkApproveUsers(user_ids) {
    if (!user_ids || user_ids.length === 0) return [];
    const query = `
      UPDATE users 
      SET is_approved = true, updated_at = NOW() 
      WHERE user_id IN (?)
    `;
    await pool.query(query, [user_ids]);
    // Notify users optionally
    return user_ids;
  },

  async bulkRevokeUsers(user_ids) {
    if (!user_ids || user_ids.length === 0) return [];
    const query = `
      UPDATE users 
      SET is_approved = false, updated_at = NOW() 
      WHERE user_id IN (?)
    `;
    await pool.query(query, [user_ids]);
    return user_ids;
  },

  async bulkDeleteUsers(user_ids) {
    if (!user_ids || user_ids.length === 0) return [];
    await pool.query(`DELETE FROM users WHERE user_id IN (?)`, [user_ids]);
    return user_ids;
  }
};

export default Users;
