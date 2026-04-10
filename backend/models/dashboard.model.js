import pool from "../config/db.js";

// Get caller stats
export const getCallerStats = async (callerId) => {
  const query = `
    SELECT 
      COALESCE(SUM(CASE WHEN hc.assigned_to_user_id = ? THEN 1 ELSE 0 END), 0) AS total_contacts,
      COALESCE(SUM(CASE WHEN hc.added_by_user_id = ? AND hc.is_approved = true THEN 1 ELSE 0 END), 0) AS approved_contacts,
      COALESCE(SUM(CASE WHEN cl.caller_id = ? THEN 1 ELSE 0 END), 0) AS total_call_logs,
      COALESCE(SUM(CASE WHEN cl.caller_id = ? AND cl.call_outcome = 'connected' THEN 1 ELSE 0 END), 0) AS connected_calls,
      COALESCE(SUM(CASE WHEN cl.caller_id = ? AND cl.next_follow_up_date IS NOT NULL THEN 1 ELSE 0 END), 0) AS follow_up_calls
    FROM hr_contacts hc
    LEFT JOIN call_logs cl ON hc.contact_id = cl.caller_id;
  `;
  const [rows] = await pool.query(query, [callerId, callerId, callerId, callerId, callerId]);
  return rows[0];
};

// Get recent call logs
export const getRecentCallLogs = async (callerId, limit = 5) => {
  const query = `
    SELECT cl.log_id, hc.full_name AS contact_name, c.company_name, cl.call_outcome, cl.call_timestamp
    FROM call_logs cl
    JOIN hr_contacts hc ON cl.contact_id = hc.contact_id
    LEFT JOIN companies c ON hc.company_id = c.company_id
    WHERE cl.caller_id = ?
    ORDER BY cl.call_timestamp DESC
    LIMIT ?;
  `;
  const [rows] = await pool.query(query, [callerId, limit]);
  return rows;
};

// Get upcoming follow-ups
export const getUpcomingFollowUps = async (callerId, limit = 5) => {
  const query = `
    SELECT cl.log_id, hc.full_name AS contact_name, c.company_name, cl.next_follow_up_date, cl.remarks
    FROM call_logs cl
    JOIN hr_contacts hc ON cl.contact_id = hc.contact_id
    LEFT JOIN companies c ON hc.company_id = c.company_id
    WHERE cl.caller_id = ?
      AND cl.next_follow_up_date >= CURRENT_DATE
    ORDER BY cl.next_follow_up_date ASC
    LIMIT ?;
  `;
  const [rows] = await pool.query(query, [callerId, limit]);
  return rows;
};

// Get today's follow-ups
export const getTodaysFollowUps = async (callerId) => {
  const query = `
    SELECT cl.log_id, hc.full_name AS contact_name, c.company_name, cl.next_follow_up_date, cl.remarks, hc.contact_id
    FROM call_logs cl
    JOIN hr_contacts hc ON cl.contact_id = hc.contact_id
    LEFT JOIN companies c ON hc.company_id = c.company_id
    WHERE cl.caller_id = ?
      AND DATE(cl.next_follow_up_date) <= CURRENT_DATE
    ORDER BY cl.next_follow_up_date ASC;
  `;
  const [rows] = await pool.query(query, [callerId]);
  return rows;
};

// Get assigned HR contacts
export const getAssignedHRContacts = async (callerId, limit = 5) => {
  const query = `
    SELECT hc.contact_id, hc.full_name, c.company_name, hc.designation, hc.status
    FROM hr_contacts hc
    LEFT JOIN companies c ON hc.company_id = c.company_id
    WHERE hc.assigned_to_user_id = ?
    LIMIT ?;
  `;
  const [rows] = await pool.query(query, [callerId, limit]);
  return rows;
};
