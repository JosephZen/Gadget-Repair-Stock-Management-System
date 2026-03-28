import { pool } from '../db.js';

export const getTutorials = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM video_tutorials ORDER BY category, created_at DESC');
        res.status(200).json({ success: true, tutorials: result.rows });
    } catch (err) {
        console.error("Error fetching tutorials:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const addTutorial = async (req, res) => {
    const { title, url, category } = req.body;
    const userId = req.user ? req.user.id : null;
    try {
        const result = await pool.query(
            'INSERT INTO video_tutorials (user_id, title, url, category) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, title, url, category]
        );
        res.status(201).json({ success: true, tutorial: result.rows[0] });
    } catch (err) {
        console.error("Error adding tutorial:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteTutorial = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM video_tutorials WHERE id = $1', [id]);
        res.status(200).json({ success: true, message: "Tutorial deleted" });
    } catch (err) {
        console.error("Error deleting tutorial:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
