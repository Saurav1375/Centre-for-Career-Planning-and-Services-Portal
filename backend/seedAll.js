import pool from './config/db.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const names = ["Aarav", "Vihaan", "Aditya", "Arjun", "Sai", "Riyan", "Aryan", "Krishna", "Ishaan", "Shaurya"];
const lastNames = ["Sharma", "Verma", "Gupta", "Singh", "Kumar", "Patel", "Das", "Reddy", "Joshi", "Bhatt"];

const compNames = ["TechNova", "GlobalReach", "InnovateX", "Syntex Solutions", "Apex Corp", "NextGen Systems", "BrightPath", "BlueSky IT", "InnoCore", "Pioneer Tech"];
const industries = ["Software", "Finance", "Healthcare", "E-commerce", "AI/ML", "Cloud Computing"];

(async () => {
    try {
        console.log("🚀 Starting seeder...");

        const defaultPassword = await bcrypt.hash('password123', 10);
        const adminPassword = await bcrypt.hash('admin123', 10);

        // 🔥 Optional: clean DB (safe for dev only)
        await pool.query("SET FOREIGN_KEY_CHECKS = 0");
        await pool.query("TRUNCATE TABLE hr_contacts");
        await pool.query("TRUNCATE TABLE companies");
        await pool.query("TRUNCATE TABLE users");
        await pool.query("SET FOREIGN_KEY_CHECKS = 1");

        // 1. Super Admin
        const adminId = crypto.randomUUID();
        await pool.query(
            `INSERT INTO users (user_id, full_name, email, role, password_hash, is_approved)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [adminId, "Super Admin", "admin@iitbhilai.ac.in", "admin", adminPassword, true]
        );
        console.log("✅ Admin created");

        // 2. Callers
        const callerIds = [];
        for (let i = 0; i < 12; i++) {
            const uuid = crypto.randomUUID();
            const callerName = `${names[i % names.length]} ${lastNames[i % lastNames.length]}${i}`;
            const email = `caller${i + 1}@iitbhilai.ac.in`;

            await pool.query(
                `INSERT INTO users (user_id, full_name, email, role, password_hash, is_approved)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [uuid, callerName, email, "caller", defaultPassword, true]
            );

            callerIds.push(uuid);
        }
        console.log("✅ Callers created");

        // 3. Companies
        const companyIds = [];
        for (let i = 0; i < 12; i++) {
            const uuid = crypto.randomUUID();
            const compName = compNames[i % compNames.length] + " " + (i + 1);

            await pool.query(
                `INSERT INTO companies (company_id, company_name, website, industry_sector, address)
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    uuid,
                    compName,
                    `www.${compName.replace(/\s+/g, '').toLowerCase()}.com`,
                    industries[i % industries.length],
                    "123 Tech Park, India"
                ]
            );

            companyIds.push(uuid);
        }
        console.log("✅ Companies created");

        // 4. HR Contacts
        for (let i = 0; i < 12; i++) {
            await pool.query(
                `INSERT INTO hr_contacts 
                (contact_id, full_name, company_id, designation, email, phone_1, status, added_by_user_id, assigned_to_user_id, is_approved)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    crypto.randomUUID(),
                    `HR ${names[(i + 2) % names.length]}`,
                    companyIds[i],
                    "Talent Acquisition",
                    `hr${i + 1}@company${i + 1}.com`,
                    `9${Math.floor(100000000 + Math.random() * 900000000)}`,
                    "New",
                    adminId,
                    callerIds[i],
                    true
                ]
            );
        }
        console.log("✅ HR contacts created");

        console.log("🎉 Seeding completed successfully!");

    } catch (e) {
        console.error("❌ Seeder error:", e.message);
    } finally {
        process.exit(0);
    }
})();