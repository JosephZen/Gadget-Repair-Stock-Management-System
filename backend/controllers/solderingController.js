import { pool } from '../db.js';

export const getSolderingProjects = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM soldering_projects ORDER BY created_at DESC');
        res.status(200).json({ success: true, projects: result.rows });
    } catch (err) {
        console.error("Error fetching soldering projects:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const addSolderingProject = async (req, res) => {
    const { title, description, image_url, drive_link } = req.body;
    const userId = req.user ? req.user.id : null;
    try {
        const result = await pool.query(
            'INSERT INTO soldering_projects (user_id, title, description, image_url, drive_link) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [userId, title, description, image_url, drive_link]
        );
        res.status(201).json({ success: true, project: result.rows[0] });
    } catch (err) {
        console.error("Error adding soldering project:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteSolderingProject = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM soldering_projects WHERE id = $1', [id]);
        res.status(200).json({ success: true, message: "Project deleted" });
    } catch (err) {
        console.error("Error deleting soldering project:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
