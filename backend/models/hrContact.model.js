import pool from '../config/db.js'
import crypto from "crypto";

export default {
  // CREATE a new HR contact
async createHRContact(contact) {
  const contact_id = crypto.randomUUID();
  const {
    full_name,
    company_id,
    designation,
    email,
    phone_1,
    phone_2,
    linkedin_profile,
    source,
    status = 'active',
    notes,
    tags = '',
    past_engagement = '',
    added_by_user_id,
    assigned_to_user_id,
    is_approved = false,
    discipline = '',
    contact_type = '',
    hiring_type = '',
    deletion_requested = false,
  } = contact;

  const query = `
      INSERT INTO hr_contacts
        (contact_id, full_name, company_id, designation, email, phone_1, phone_2, linkedin_profile, source, status, notes, tags, past_engagement, added_by_user_id, assigned_to_user_id, is_approved, discipline, contact_type, hiring_type, deletion_requested)
      VALUES
        (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;

  const values = [
    contact_id,
    full_name,
    company_id,
    designation,
    email,
    phone_1,
    phone_2,
    linkedin_profile,
    source,
    status,
    notes,
    tags,
    past_engagement,
    added_by_user_id,
    assigned_to_user_id,
    is_approved,
    discipline,
    contact_type,
    hiring_type,
    deletion_requested,
  ];

  await pool.query(query, values);
  const [rows] = await pool.query(`SELECT i.*, c.company_name FROM hr_contacts i LEFT JOIN companies c ON i.company_id = c.company_id WHERE i.contact_id = ?`, [contact_id]);
  return rows[0];
},

// READ all HR contacts (with added_by, assigned_to user names, and company name)
async getAllHRContacts() {
  const query = `
    SELECT 
      hc.*,
      u1.full_name AS added_by_user_name,
      u2.full_name AS assigned_to_user_name,
      c.company_name
    FROM hr_contacts hc
    LEFT JOIN users u1 ON hc.added_by_user_id = u1.user_id
    LEFT JOIN users u2 ON hc.assigned_to_user_id = u2.user_id
    LEFT JOIN companies c ON hc.company_id = c.company_id
    ORDER BY hc.created_at DESC
  `;

  const [rows] = await pool.query(query);
  return rows;
},

// READ one HR contact by ID (with user names and company name)
async getHRContactById(contact_id) {
  const query = `
    SELECT 
      hc.*,
      u1.full_name AS added_by_user_name,
      u2.full_name AS assigned_to_user_name,
      c.company_name
    FROM hr_contacts hc
    LEFT JOIN users u1 ON hc.added_by_user_id = u1.user_id
    LEFT JOIN users u2 ON hc.assigned_to_user_id = u2.user_id
    LEFT JOIN companies c ON hc.company_id = c.company_id
    WHERE hc.contact_id = ?
  `;

  const [rows] = await pool.query(query, [contact_id]);
  return rows[0];
},

  // UPDATE an HR contact by ID
  async updateHRContact(contact_id, contact) {
    const {
      full_name,
      company_id,
      designation,
      email,
      phone_1,
      phone_2,
      linkedin_profile,
      source,
      status,
      notes,
      tags = '',
      past_engagement = '',
      assigned_to_user_id,
      is_approved,
      discipline = '',
      contact_type = '',
      hiring_type = '',
      deletion_requested = false,
    } = contact;

    await pool.query(
      `UPDATE hr_contacts
       SET full_name=?, company_id=?, designation=?, email=?, phone_1=?, phone_2=?, linkedin_profile=?, source=?, status=?, notes=?, tags=?, past_engagement=?, assigned_to_user_id=?, is_approved=?, discipline=?, contact_type=?, hiring_type=?, deletion_requested=?, updated_at=NOW()
       WHERE contact_id=?`,
      [
        full_name,
        company_id,
        designation,
        email,
        phone_1,
        phone_2,
        linkedin_profile,
        source,
        status,
        notes,
        tags,
        past_engagement,
        assigned_to_user_id,
        is_approved,
        discipline,
        contact_type,
        hiring_type,
        deletion_requested,
        contact_id,
      ]
    );

    const [rows] = await pool.query(`SELECT * FROM hr_contacts WHERE contact_id = ?`, [contact_id]);
    return rows[0];
  },



  async requestDeletion(contact_id, reason = '') {
    await pool.query(
      `UPDATE hr_contacts
       SET deletion_requested = true, deletion_reason = ?, updated_at = NOW()
       WHERE contact_id = ?`,
      [reason, contact_id]
    );
    const [rows] = await pool.query(`SELECT * FROM hr_contacts WHERE contact_id = ?`, [contact_id]);
    return rows[0];
  },

async toggleHRContactApproval(contact_id) {
  await pool.query(
    `UPDATE hr_contacts
     SET is_approved = NOT is_approved, updated_at = NOW()
     WHERE contact_id = ?`,
    [contact_id]
  );
  const [rows] = await pool.query(`SELECT * FROM hr_contacts WHERE contact_id = ?`, [contact_id]);
  return rows[0];
},



async assignCallerToHR(contact_id, assigned_to_user_id) {
  const query = `
    UPDATE hr_contacts
    SET assigned_to_user_id = ?, updated_at = NOW()
    WHERE contact_id = ?`;

  const values = [assigned_to_user_id, contact_id];
  await pool.query(query, values);
  const [rows] = await pool.query(`SELECT * FROM hr_contacts WHERE contact_id = ?`, [contact_id]);
  return rows[0];
},



async assignHRsToCaller(callerId, hrIds) {
    if(!hrIds || hrIds.length === 0) return [];
    const placeholders = hrIds.map(() => '?').join(',');
    const query = `
      UPDATE hr_contacts
      SET assigned_to_user_id = ?, updated_at = NOW()
      WHERE contact_id IN (${placeholders})
    `;
    await pool.query(query, [callerId, ...hrIds]);
    const [rows] = await pool.query(`SELECT * FROM hr_contacts WHERE contact_id IN (${placeholders})`, [...hrIds]);
    return rows;
  },


  async unassignHRs(hrIds) {
  if(!hrIds || hrIds.length === 0) return [];
  const placeholders = hrIds.map(() => '?').join(',');
  const query = `
    UPDATE hr_contacts
    SET assigned_to_user_id = NULL, updated_at = NOW()
    WHERE contact_id IN (${placeholders})
  `;
  await pool.query(query, [...hrIds]);
  const [rows] = await pool.query(`SELECT * FROM hr_contacts WHERE contact_id IN (${placeholders})`, [...hrIds]);
  return rows;
},



  // DELETE an HR contact by ID
  async deleteHRContact(contact_id) {
    const [rows] = await pool.query(`SELECT * FROM hr_contacts WHERE contact_id = ?`, [contact_id]);
    if(rows.length === 0) return null;
    await pool.query(
      `DELETE FROM hr_contacts WHERE contact_id=?`,
      [contact_id]
    );
    return rows[0];
  },
};
