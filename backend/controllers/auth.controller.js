import pool from "../config/db.js";
import crypto from 'crypto';
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";
import { createNotification } from "../utils/notifications.js";
import dotenv from "dotenv";

dotenv.config();

// Helper function to update the 'updated_at' timestamp
const updateTimestamp = async (userId) => {
    await pool.query('UPDATE users SET updated_at = NOW() WHERE user_id = ?', [userId]);
};

export const signup = async (req, res) => {
  try {
    const { name, email, password, branch } = req.body;
    let role = req.body.role || 'caller';

    // Role-based email validation
    if (role !== "Recruiter") {
      if (!email.endsWith("@iitbhilai.ac.in")) {
        return res
          .status(400)
          .json({ success: false, message: "Only IIT Bhilai emails are allowed for this role" });
      }
    }

    // Check if user already exists
    const [existingUsers] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
    const user = existingUsers[0];

    if (user) {
      if (user.is_approved) {
        return res.status(400).json({ success: false, message: "User already exists and is approved" });
      }
      return res.status(400).json({ success: false, message: "User exists and is pending admin approval" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if email is in preapproved_emails
    const [preapprovedRes] = await pool.query("SELECT 1 FROM preapproved_emails WHERE email = ?", [email]);
    const isPreapproved = preapprovedRes.length > 0;

    const user_id = crypto.randomUUID();

    // Insert new user
    const insertUserQuery = `
      INSERT INTO users (user_id, full_name, email, role, password_hash, is_approved, branch)
      VALUES (?, ?, ?, ?, ?, ?, ?)`;

    await pool.query(insertUserQuery, [
      user_id,
      name,
      email,
      role,
      hashedPassword,
      isPreapproved, // Auto-approved if in preapproved_emails
      branch || null
    ]);

    if (!isPreapproved) {
      // Notify all admins and moderators
      const [admins] = await pool.query('SELECT user_id FROM users WHERE role IN ("admin", "moderator")');
      for (const admin of admins) {
        await createNotification(
          admin.user_id,
          "New User Registration",
          `${name} (${role}) has registered and requires approval.`,
          "approval"
        );
      }
    }

    res.status(201).json({ success: true, userId: user_id, autoApproved: isPreapproved });
  } catch (e) {
    console.error("Error in signup controller", e.message);
    res.status(500).json({ success: false, error: "Server Error" });
  }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(400).json({ message: "Invalid email or password" });
        
        const user = users[0];
        const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid email or password" });

        if (!user.is_approved) {
            return res.status(403).json({ success: false, userId: user.user_id, message: "Pending Admin Approval. Please contact an admin." });
        }

        const token = generateTokenAndSetCookie(user.user_id, res);
        const userData = {
            _id: user.user_id,
            name: user.full_name,
            email: user.email,
            role: user.role,
        };

        res.status(200).json({ success: true, userData, token });

    } catch (e) {
        console.log("error in login controller", e.message);
        res.status(500).json({ success: false, error: "Server Error" });
    }
};

export const logout = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ success: true, message: "Logged out successfully" });
    } catch (e) {
        console.log("error in logout controller", e.message);
        res.status(500).json({ success: false, error: "Server Error" });
    }
};