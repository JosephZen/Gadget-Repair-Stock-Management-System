import { pool } from '../db.js';

export const getFolders = async (req, res) => {
    const { parentId } = req.query; // If null, fetch root folders
    const userId = req.user ? req.user.id : null;
    try {
        const query = parentId 
            ? 'SELECT * FROM project_folders WHERE parent_id = $1 ORDER BY name' 
            : 'SELECT * FROM project_folders WHERE parent_id IS NULL ORDER BY name';
        const params = parentId ? [parentId] : [];
        const result = await pool.query(query, params);
        res.status(200).json({ success: true, folders: result.rows });
    } catch (err) {
        console.error("Error fetching folders:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const createFolder = async (req, res) => {
    const { name, parent_id, link_url } = req.body;
    const userId = req.user ? req.user.id : null;
    try {
        const result = await pool.query(
            'INSERT INTO project_folders (user_id, name, parent_id, link_url) VALUES ($1, $2, $3, $4) RETURNING *',
            [userId, name, parent_id || null, link_url || null]
        );
        res.status(201).json({ success: true, folder: result.rows[0] });
    } catch (err) {
        console.error("Error creating folder:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updateFolder = async (req, res) => {
    const { id } = req.params;
    const { name, link_url } = req.body;
    try {
        const result = await pool.query(
            'UPDATE project_folders SET name = $1, link_url = $2 WHERE id = $3 RETURNING *',
            [name, link_url || null, id]
        );
        res.status(200).json({ success: true, folder: result.rows[0] });
    } catch (err) {
        console.error("Error updating folder:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteFolder = async (req, res) => {
    const { id } = req.params;
    try {
        // This will cascade delete subfolders due to the schema table constraint
        await pool.query('DELETE FROM project_folders WHERE id = $1', [id]);
        res.status(200).json({ success: true, message: "Deleted" });
    } catch (err) {
        console.error("Error deleting folder:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
