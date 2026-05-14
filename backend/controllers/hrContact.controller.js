import HRContact from '../models/hrContact.model.js';
import { exportToCSV } from '../utils/exportCSV.js';
import { createNotification } from '../utils/notifications.js';
import pool from '../config/db.js';

// CREATE a new HR contact
export const createHRContact = async (req, res) => {
  try {
    const added_by_user_id = req.user.user_id; // Logged-in user
    const contact = { ...req.body, added_by_user_id };
    const newContact = await HRContact.createHRContact(contact);
    res.status(201).json({ success: true, data: newContact });
    
    // Notify all admins
    const [admins] = await pool.query('SELECT user_id FROM users WHERE role = "Admin"');
    for (const admin of admins) {
      await createNotification(
        admin.user_id,
        "New HR Contact Added",
        `${req.user.full_name} added a new HR contact for ${newContact.company_name}. Please review and approve.`,
        "approval"
      );
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// GET all HR contacts
export const getAllHRContacts = async (req, res) => {
  try {
    const contacts = await HRContact.getAllHRContacts();
    res.json({ success: true, data: contacts });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// GET a single HR contact
export const getHRContactById = async (req, res) => {
  try {
    const contact = await HRContact.getHRContactById(req.params.id);
    if (!contact) return res.status(404).json({ success: false, message: "Not Found" });
    res.json({ success: true, data: contact });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// UPDATE an HR contact
export const updateHRContact = async (req, res) => {
  try {
    const isCaller = req.user.role.toLowerCase() === 'caller';
    const contactData = { ...req.body };

    if (isCaller) {
      contactData.is_approved = false; // Forces re-approval
      
      // Notify admins
      const [admins] = await pool.query('SELECT user_id FROM users WHERE role IN ("admin", "moderator")');
      for (const admin of admins) {
        await createNotification(
          admin.user_id,
          "HR Contact Modified",
          `${req.user.full_name} modified HR contact ${contactData.full_name}. Please review and approve.`,
          "approval"
        );
      }
    }

    const updatedContact = await HRContact.updateHRContact(req.params.id, contactData);
    if (!updatedContact) return res.status(404).json({ success: false, message: "Not Found" });
    res.json({ success: true, data: updatedContact });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Request Deletion of HR Contact
export const requestHRDeletion = async (req, res) => {
  try {
    const reason = req.body.reason || '';
    const updatedContact = await HRContact.requestDeletion(req.params.id, reason);
    if (!updatedContact) return res.status(404).json({ success: false, message: "Not Found" });
    
    // Notify all admins and moderators
    const [admins] = await pool.query('SELECT user_id FROM users WHERE role IN ("admin", "moderator")');
    for (const admin of admins) {
      await createNotification(
        admin.user_id,
        "HR Contact Deletion Request",
        `${req.user.full_name} requested deletion of HR contact ${updatedContact.full_name} from ${updatedContact.company_name || 'a company'}. Reason: ${reason}`,
        "system"
      );
    }
    
    res.json({ success: true, data: updatedContact });
  } catch (error) {
    console.error("Error requesting HR deletion:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



export const assignCallerToHR = async (req, res) => {
  try {
    const { assigned_to_user_id } = req.body;

    if (!assigned_to_user_id) {
      return res.status(400).json({ 
        success: false, 
        message: "assigned_to_user_id is required in request body" 
      });
    }

    const updatedContact = await HRContact.assignCallerToHR(req.params.id, assigned_to_user_id);

    if (!updatedContact) {
      return res.status(404).json({ success: false, message: "Contact not found" });
    }

    res.json({ success: true, data: updatedContact });
  } catch (error) {
    console.error("assignCallerToHR error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


// Assign multiple HRs to a caller
export const assignHRsToCaller = async (req, res) => {
  try {
    const { hrIds } = req.body; 
    const { callerId } = req.params;

    if (!Array.isArray(hrIds) || hrIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "hrIds must be a non-empty array",
      });
    }

    const updatedContacts = await HRContact.assignHRsToCaller(callerId, hrIds);

    res.json({
      success: true,
      data: updatedContacts,
    });
  } catch (error) {
    console.error("Error in assignHRsToCaller:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


// Unassign multiple HRs
export const unassignHRs = async (req, res) => {
  try {
    const { hrIds } = req.body;

    if (!Array.isArray(hrIds) || hrIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "hrIds must be a non-empty array",
      });
    }

    const updatedContacts = await HRContact.unassignHRs(hrIds);

    res.json({
      success: true,
      data: updatedContacts,
    });
  } catch (error) {
    console.error("Error in unassignHRs:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};




// DELETE an HR contact
export const deleteHRContact = async (req, res) => {
  try {
    const deletedContact = await HRContact.deleteHRContact(req.params.id);
    if (!deletedContact) return res.status(404).json({ success: false, message: "Not Found" });
    res.json({ success: true, data: deletedContact });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};



export const toggleApproval = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedContact = await HRContact.toggleHRContactApproval(id);

    if (!updatedContact) {
      return res.status(404).json({ message: "HR Contact not found" });
    }

    res.json({
      message: `HR Contact approval status updated to ${updatedContact.is_approved}`,
      contact: updatedContact,
    });
  } catch (error) {
    console.error("Error toggling HR contact approval:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// EXPORT HR contacts as CSV
export const exportHRContactsCSV = async (req, res) => {
  try {
    const contacts = await HRContact.getAllHRContacts();
    const csvData = exportToCSV(contacts); // Converts array of objects to CSV string

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="hr_contacts.csv"');
    res.send(csvData);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: "Failed to export CSV" });
  }
};
