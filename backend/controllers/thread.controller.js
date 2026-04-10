import pool from '../config/db.js';
import crypto from 'crypto';

export const getThreads = async (req, res) => {
    try {
        const query = `
            SELECT t.*, u.full_name as author_name, u.email as author_email,
            (SELECT GROUP_CONCAT(user_id) FROM thread_upvotes WHERE thread_id = t.thread_id) as upvoted_by,
            (SELECT GROUP_CONCAT(user_id) FROM thread_downvotes WHERE thread_id = t.thread_id) as downvoted_by
            FROM threads t
            LEFT JOIN users u ON t.author_id = u.user_id
            ORDER BY t.created_at DESC
        `;
        const [threadRows] = await pool.query(query);

        const commentQuery = `
            SELECT c.*, u.full_name as author_name, u.email as author_email
            FROM comments c
            LEFT JOIN users u ON c.author_id = u.user_id
            ORDER BY c.created_at ASC
        `;
        const [commentRows] = await pool.query(commentQuery);

        const threads = threadRows.map(thread => {
            const comments = commentRows.filter(c => c.thread_id === thread.thread_id);
            return {
                _id: thread.thread_id,
                title: thread.title,
                text: thread.text,
                file: thread.file_id ? `/api/files/${thread.file_id}` : null,
                author: { _id: thread.author_id, name: thread.author_name },
                upvotes: thread.upvoted_by ? thread.upvoted_by.split(',') : [],
                downvotes: thread.downvoted_by ? thread.downvoted_by.split(',') : [],
                comments: comments.map(c => ({
                    _id: c.comment_id,
                    text: c.text,
                    file: c.file_id ? `/api/files/${c.file_id}` : null,
                    author: { _id: c.author_id, name: c.author_name },
                    createdAt: c.created_at
                })),
                createdAt: thread.created_at
            };
        });

        res.status(200).json({ success: true, threads });
    } catch (e) {
        console.error("error in getThreads controller", e.message);
        res.status(500).json({ success: false, error: "Server Error" });
    }
}

export const createThread = async (req, res) => {
    try {
        const loggedInUser = req.userId;
        const { title, text, file } = req.body;

        let file_id = null;
        if (file) {
            const matches = file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                const mime_type = matches[1];
                const file_data = Buffer.from(matches[2], 'base64');
                file_id = crypto.randomUUID();
                await pool.query('INSERT INTO files (file_id, mime_type, file_data) VALUES (?, ?, ?)', [file_id, mime_type, file_data]);
            }
        }

        const thread_id = crypto.randomUUID();
        await pool.query(
            'INSERT INTO threads (thread_id, author_id, title, text, file_id) VALUES (?, ?, ?, ?, ?)',
            [thread_id, loggedInUser, title, text, file_id]
        );

        res.status(201).json({ success: true, message: "Thread created successfully" });
    } catch (e) {
        console.error("error in createThread controller", e.message);
        res.status(500).json({ success: false, error: "Server Error" });
    }
}

export const createComment = async (req, res) => {
    try {
        const author = req.userId;
        const { threadId } = req.params;
        const { text, file } = req.body;

        const [existing] = await pool.query('SELECT thread_id FROM threads WHERE thread_id = ?', [threadId]);
        if (existing.length === 0) {
            return res.status(404).json({ success: false, message: "Thread not found" });
        }

        let file_id = null;
        if (file) {
            const matches = file.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (matches && matches.length === 3) {
                const mime_type = matches[1];
                const file_data = Buffer.from(matches[2], 'base64');
                file_id = crypto.randomUUID();
                await pool.query('INSERT INTO files (file_id, mime_type, file_data) VALUES (?, ?, ?)', [file_id, mime_type, file_data]);
            }
        }

        const comment_id = crypto.randomUUID();
        await pool.query(
            'INSERT INTO comments (comment_id, thread_id, author_id, text, file_id) VALUES (?, ?, ?, ?, ?)',
            [comment_id, threadId, author, text, file_id]
        );

        res.status(201).json({ success: true, message: "Comment created" });
    } catch (e) {
        console.error("error in createComment controller", e.message);
        res.status(500).json({ success: false, error: "Server Error" });
    }
}

export const upvote = async (req, res) => {
    try {
        const { threadId } = req.params;
        const userId = req.userId;

        const [hasUpvoted] = await pool.query('SELECT * FROM thread_upvotes WHERE thread_id = ? AND user_id = ?', [threadId, userId]);
        
        if (hasUpvoted.length > 0) {
            // Remove upvote
            await pool.query('DELETE FROM thread_upvotes WHERE thread_id = ? AND user_id = ?', [threadId, userId]);
        } else {
            // Add upvote, remove downvote
            await pool.query('DELETE FROM thread_downvotes WHERE thread_id = ? AND user_id = ?', [threadId, userId]);
            await pool.query('INSERT INTO thread_upvotes (thread_id, user_id) VALUES (?, ?)', [threadId, userId]);
        }

        res.status(200).json({ success: true });
    } catch (e) {
        console.error("error in upvote controller", e.message);
        res.status(500).json({ success: false, error: "Server Error" });
    }
}

export const downvote = async (req, res) => {
    try {
        const { threadId } = req.params;
        const userId = req.userId;

        const [hasDownvoted] = await pool.query('SELECT * FROM thread_downvotes WHERE thread_id = ? AND user_id = ?', [threadId, userId]);
        
        if (hasDownvoted.length > 0) {
            // Remove downvote
            await pool.query('DELETE FROM thread_downvotes WHERE thread_id = ? AND user_id = ?', [threadId, userId]);
        } else {
            // Add downvote, remove upvote
            await pool.query('DELETE FROM thread_upvotes WHERE thread_id = ? AND user_id = ?', [threadId, userId]);
            await pool.query('INSERT INTO thread_downvotes (thread_id, user_id) VALUES (?, ?)', [threadId, userId]);
        }

        res.status(200).json({ success: true });
    } catch (e) {
        console.error("error in downvote controller", e.message);
        res.status(500).json({ success: false, error: "Server Error" });
    }
}