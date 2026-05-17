import CallLog from "../models/callLog.model.js";
import { createNotification } from "../utils/notifications.js";

// Create new log
export const createCallLog = async (req, res) => {
  try {
    const newLog = await CallLog.createLog({
      ...req.body,
      caller_id: req.userId // from auth middleware
    });

    if (req.body.hiring_tag === "confirmed") {
      const [contactRows] = await CallLog.getDb().query(
        `SELECT full_name FROM hr_contacts WHERE contact_id = ?`,
        [req.body.contact_id]
      );
      const confirmedContactName = contactRows[0]?.full_name || "an HR contact";
      const [admins] = await CallLog.getDb().query(
        `SELECT user_id FROM users WHERE role IN ("admin", "moderator")`
      );
      for (const admin of admins) {
        await createNotification(
          admin.user_id,
          "Confirmed HR Contact",
          `${req.user.full_name} marked ${confirmedContactName} as confirmed. Review Confirmed HRs.`,
          "confirmed_hr"
        );
      }
    }

    res.json({ success: true, data: newLog });
  } catch (error) {
    console.error("Error in createCallLog:", error.message);
    if (error.message.includes("mandatory")) {
      return res.status(400).json({ success: false, message: error.message });
    }
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get all logs
export const getAllCallLogs = async (req, res) => {
  try {
    const logs = await CallLog.getAllLogs();
    res.json({ success: true, data: logs });
  } catch (error) {
    console.error("Error in getAllCallLogs:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get single log
export const getCallLogById = async (req, res) => {
  try {
    const log = await CallLog.getLogById(req.params.id);
    if (!log) return res.status(404).json({ success: false, message: "Log not found" });
    res.json({ success: true, data: log });
  } catch (error) {
    console.error("Error in getCallLogById:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Update log
export const updateCallLog = async (req, res) => {
  try {
    const updatedLog = await CallLog.updateLog(req.params.id, req.body);
    if (!updatedLog) return res.status(404).json({ success: false, message: "Log not found or no changes" });
    res.json({ success: true, data: updatedLog });
  } catch (error) {
    console.error("Error in updateCallLog:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// Delete a log
export const deleteCallLog = async (req, res) => {
  try {
    const log_id = req.params.id;

    const log = await CallLog.getLogById(log_id);
    if (!log) return res.status(404).json({ success: false, message: "Log not found" });

    const deletedLog = await CallLog.deleteLog(log_id);

    res.json({ success: true, data: deletedLog });
  } catch (error) {
    console.error("Error in deleteCallLog:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};