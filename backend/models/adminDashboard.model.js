import pool from "../config/db.js";

// Get high-level stats
export const getStats = async (userId = null, weekOffset = 0) => {
  const offsetDays = weekOffset * 7;
  const startDay = offsetDays + 7;
  
  let userCondition = "";
  const values = [startDay, offsetDays, startDay, offsetDays];
  if (userId && userId !== "all") {
    userCondition = "WHERE caller_id = ?";
    values.push(userId);
  }

  const query = `
    SELECT 
      COALESCE(SUM(CASE WHEN call_timestamp >= NOW() - INTERVAL ? DAY AND call_timestamp <= NOW() - INTERVAL ? DAY THEN 1 ELSE 0 END), 0) AS total_calls,
      COALESCE(SUM(CASE WHEN call_outcome = 'positive' AND call_timestamp >= NOW() - INTERVAL ? DAY AND call_timestamp <= NOW() - INTERVAL ? DAY THEN 1 ELSE 0 END), 0) AS positive_responses,
      COALESCE(SUM(CASE WHEN next_follow_up_date >= NOW() THEN 1 ELSE 0 END), 0) AS followups_pending,
      (SELECT COUNT(*) FROM hr_contacts WHERE created_at >= NOW() - INTERVAL 7 DAY) AS new_contacts
    FROM call_logs
    ${userCondition};
  `;
  const [rows] = await pool.query(query, values);
  return rows[0];
};

// Weekly Call Activity
export const getWeeklyCallActivity = async (userId = null, weekOffset = 0) => {
  const offsetDays = weekOffset * 7;
  const startDay = offsetDays + 7;
  
  let userCondition = "";
  const values = [startDay, offsetDays];
  if (userId && userId !== "all") {
    userCondition = "AND caller_id = ?";
    values.push(userId);
  }

  const query = `
    SELECT 
      DATE_FORMAT(call_timestamp, '%a') AS day,
      COALESCE(SUM(CASE WHEN call_outcome = 'positive' THEN 1 ELSE 0 END), 0) AS positive,
      COALESCE(SUM(CASE WHEN call_outcome = 'follow-up' THEN 1 ELSE 0 END), 0) AS follow_up,
      COALESCE(SUM(CASE WHEN call_outcome = 'not reachable' THEN 1 ELSE 0 END), 0) AS not_reachable
    FROM call_logs
    WHERE call_timestamp >= NOW() - INTERVAL ? DAY
      AND call_timestamp <= NOW() - INTERVAL ? DAY
      ${userCondition}
    GROUP BY day, DATE(call_timestamp)
    ORDER BY DATE(call_timestamp);
  `;
  const [rows] = await pool.query(query, values);
  return rows;
};

// Recent Activity
export const getRecentActivity = async (userId = null) => {
  let userCondition = "";
  const values = [];
  if (userId && userId !== "all") {
    userCondition = "WHERE cl.caller_id = ?";
    values.push(userId);
  }

  const query = `
    SELECT cl.log_id AS id, u.full_name AS user, 
           LEFT(u.full_name, 2) AS initials,
           'logged a call with' AS action,
           hc.full_name AS subject,
           c.company_name AS company,
           cl.call_outcome AS outcome,
           cl.call_timestamp
    FROM call_logs cl
    JOIN users u ON cl.caller_id = u.user_id
    JOIN hr_contacts hc ON cl.contact_id = hc.contact_id
    LEFT JOIN companies c ON hc.company_id = c.company_id
    ${userCondition}
    ORDER BY cl.call_timestamp DESC
    LIMIT 10;
  `;
  const [rows] = await pool.query(query, values);
  return rows;
};

// Top Callers
export const getTopCallers = async (weekOffset = 0) => {
  const offsetDays = weekOffset * 7;
  const startDay = offsetDays + 7;

  const query = `
    SELECT u.user_id AS id, u.full_name AS name, 
           LEFT(u.full_name, 2) AS initials,
           COUNT(cl.log_id) AS calls
    FROM call_logs cl
    JOIN users u ON cl.caller_id = u.user_id
    WHERE cl.call_timestamp >= NOW() - INTERVAL ? DAY
      AND cl.call_timestamp <= NOW() - INTERVAL ? DAY
    GROUP BY u.user_id, u.full_name
    ORDER BY calls DESC
    LIMIT 5;
  `;
  const [rows] = await pool.query(query, [startDay, offsetDays]);
  return rows;
};

// Action Items
export const getActionItems = async () => {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM users WHERE is_approved = false) AS new_users,
      (SELECT COUNT(*) FROM hr_contacts WHERE is_approved = false) AS pending_contacts,
      (SELECT COUNT(*) FROM call_logs WHERE next_follow_up_date < NOW()) AS overdue_followups;
  `;
  const [rows] = await pool.query(query);
  return rows[0];
};
