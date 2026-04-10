import pool from "../config/db.js";
import crypto from 'crypto';

const Company = {
  // Create company
  async createCompany({ company_name, website, industry_sector, address }) {
    const company_id = crypto.randomUUID();
    const query = `
      INSERT INTO companies (company_id, company_name, website, industry_sector, address)
      VALUES (?, ?, ?, ?, ?)
    `;
    const values = [company_id, company_name, website, industry_sector, address];
    await pool.query(query, values);
    const [rows] = await pool.query(`SELECT * FROM companies WHERE company_id = ?`, [company_id]);
    return rows[0];
  },

  // Get all companies
  async getAllCompanies() {
    const [rows] = await pool.query(`SELECT * FROM companies ORDER BY created_at DESC;`);
    return rows;
  },

  // Get single company
  async getCompanyById(id) {
    const [rows] = await pool.query(`SELECT * FROM companies WHERE company_id=?;`, [id]);
    return rows[0];
  },

  // Update company
  async updateCompany(id, data) {
    const fields = [];
    const values = [];

    for (const [key, value] of Object.entries(data)) {
      fields.push(`${key}=?`);
      values.push(value);
    }

    if (fields.length === 0) return null;

    values.push(id);
    const query = `
      UPDATE companies
      SET ${fields.join(", ")}, created_at=NOW()
      WHERE company_id=?
    `;
    await pool.query(query, values);
    const [rows] = await pool.query(`SELECT * FROM companies WHERE company_id = ?`, [id]);
    return rows[0];
  },

  // Delete company
  async deleteCompany(id) {
    const [rows] = await pool.query(`SELECT * FROM companies WHERE company_id = ?`, [id]);
    if(rows.length === 0) return null;
    await pool.query(`DELETE FROM companies WHERE company_id=?;`, [id]);
    return rows[0];
  }
};

export default Company;
