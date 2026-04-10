import cron from "node-cron";
import pool from "../config/db.js";
import { createNotification } from "./notifications.js";

// Run everyday at 8:00 AM
cron.schedule("0 8 * * *", async () => {
    try {
        console.log("Running follow-up cron job...");
        const [logs] = await pool.query(`
            SELECT cl.log_id, cl.caller_id, cl.next_follow_up_date, hc.full_name AS contact_name
            FROM call_logs cl
            JOIN hr_contacts hc ON cl.contact_id = hc.contact_id
            WHERE cl.next_follow_up_date = CURRENT_DATE
        `);
        for (const log of logs) {
            await createNotification(
                log.caller_id,
                "Follow-up Reminder",
                `Reminder: You have a scheduled follow-up with ${log.contact_name} today.`,
                "follow_up"
            );
        }
        console.log("Completed follow-up cron job.");
    } catch(err) {
        console.error("Cron Job Error:", err);
    }
});
