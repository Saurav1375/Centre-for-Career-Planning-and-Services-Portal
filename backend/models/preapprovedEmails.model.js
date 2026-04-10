import pool from "../config/db.js";

const PreapprovedEmail = {
  async getAll() {
    const query = `SELECT * FROM preapproved_emails ORDER BY created_at DESC;`;
    const [rows] = await pool.query(query);
    return rows;
  },

  async bulkInsert(emails) {
    if(!emails || emails.length === 0) return [];
    
    // MariaDB bulk insert: INSERT IGNORE INTO ... VALUES ?
    const query = `
      INSERT IGNORE INTO preapproved_emails (email)
      VALUES ?
    `;
    const values = emails.map(email => [email]);
    await pool.query(query, [values]);
    
    const placeholders = emails.map(() => '?').join(',');
    const [rows] = await pool.query(`SELECT * FROM preapproved_emails WHERE email IN (${placeholders})`, [...emails]);
    return rows;
  },

  async bulkDelete(emails) {
    if(!emails || emails.length === 0) return;
    const placeholders = emails.map(() => '?').join(',');
    const query = `DELETE FROM preapproved_emails WHERE email IN (${placeholders});`;
    await pool.query(query, [...emails]);
  }
};

export default PreapprovedEmail;
