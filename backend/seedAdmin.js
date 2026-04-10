import pool from './config/db.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

(async () => {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const uuid = crypto.randomUUID();
        await pool.query(
            'INSERT INTO users (user_id, full_name, email, role, password_hash, is_approved) VALUES (?, ?, ?, ?, ?, ?)',
            [uuid, 'Super Admin', 'admin@iitbhilai.ac.in', 'admin', hashedPassword, true]
        );
        console.log('Super Admin seeded successfully!\nEmail: admin@iitbhilai.ac.in\nPassword: admin123');
    } catch (e) {
        console.log('Error seeding admin', e.message);
    } finally {
        process.exit();
    }
})();
