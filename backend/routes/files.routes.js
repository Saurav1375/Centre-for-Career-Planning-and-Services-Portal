import express from 'express';
import pool from '../config/db.js';

const router = express.Router();

// GET a file directly from MariaDB
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT mime_type, file_data FROM files WHERE file_id = ?', [req.params.id]);
        if (rows.length === 0) return res.status(404).send('File not found');

        const file = rows[0];
        res.setHeader('Content-Type', file.mime_type);
        res.send(file.file_data);
    } catch (e) {
        console.error(e.message);
        res.status(500).send('Server Error');
    }
});

export default router;
