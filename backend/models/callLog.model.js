import pool from "../config/db.js";
import crypto from "crypto";

const CallLog = {
  // Create a new log
  async createLog({ contact_id, caller_id, call_mode, call_outcome, hiring_tag, duration, conversation_summary, next_follow_up_date, remarks, admin_comments, recruitment_cycle }) {
    if (!contact_id || !caller_id || !call_mode || !call_outcome || !hiring_tag || !duration || !conversation_summary || !next_follow_up_date || !recruitment_cycle) {
        throw new Error("All call log fields are mandatory.");
    }
    const log_id = crypto.randomUUID();
    const query = `
      INSERT INTO call_logs 
        (log_id, contact_id, caller_id, call_mode, call_outcome, hiring_tag, duration, conversation_summary, next_follow_up_date, remarks, admin_comments, recruitment_cycle)
      VALUES 
        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    const values = [log_id, contact_id, caller_id, call_mode, call_outcome, hiring_tag, duration, conversation_summary, next_follow_up_date, remarks, admin_comments, recruitment_cycle];
    await pool.query(query, values);
    const [rows] = await pool.query(`SELECT * FROM call_logs WHERE log_id = ?`, [log_id]);
    return rows[0];
  },

  // Get all logs
  async getAllLogs() {
  const query = `
    SELECT cl.*, hc.full_name AS hr_name, u.full_name AS caller_name, c.company_name
    FROM call_logs cl
    JOIN hr_contacts hc ON cl.contact_id = hc.contact_id
    JOIN users u ON cl.caller_id = u.user_id
    LEFT JOIN companies c ON hc.company_id = c.company_id
    ORDER BY cl.call_timestamp DESC;
  `;
  const [rows] = await pool.query(query);
  return rows;
},

  // Get a single log by ID
  async getLogById(log_id) {
  const query = `
    SELECT cl.*, hc.full_name AS hr_name, u.full_name AS caller_name, c.company_name
    FROM call_logs cl
    JOIN hr_contacts hc ON cl.contact_id = hc.contact_id
    JOIN users u ON cl.caller_id = u.user_id
    LEFT JOIN companies c ON hc.company_id = c.company_id
    WHERE cl.log_id = ?;
  `;
  const [rows] = await pool.query(query, [log_id]);
  return rows[0];
},

  // Update a log
  async updateLog(log_id, data) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key}=?`);
      values.push(value);
    }

    if (fields.length === 0) return null;

    const query = `
      UPDATE call_logs
      SET ${fields.join(", ")}
      WHERE log_id=?
    `;
    values.push(log_id);

    await pool.query(query, values);
    const [rows] = await pool.query(`SELECT * FROM call_logs WHERE log_id = ?`, [log_id]);
    return rows[0];
  },

  // Delete a log
    async deleteLog(log_id) {
        const [rows] = await pool.query(`SELECT * FROM call_logs WHERE log_id = ?`, [log_id]);
        if(rows.length === 0) return null;
        
        const query = `
        DELETE FROM call_logs
        WHERE log_id = ?
        `;
        await pool.query(query, [log_id]);
        return rows[0];
    }

};

export default CallLog;
