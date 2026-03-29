import { pool } from '../db.js';

const normalizeInput = (val) => {
    if (val === null || val === undefined) return null;
    const trimmed = String(val).trim();
    return trimmed === '' ? null : trimmed;
};

export const getComponentById = async (req, res) => {
    const { id } = req.params;
    try {
        const componentResult = await pool.query('SELECT * FROM components WHERE id = $1', [id]);
        if (componentResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Component not found" });
        }
        const linksResult = await pool.query('SELECT id, component_id, store_name AS supplier_name, url AS link_url, price FROM supplier_links WHERE component_id = $1', [id]);
        res.status(200).json({ success: true, component: componentResult.rows[0], links: linksResult.rows });
    } catch (err) {
        console.error("Error fetching component:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const addComponent = async (req, res) => {
    let { brand, model, category, condition, description, stock_quantity, image_url } = req.body;
    
    // Normalize string inputs (trim + empty -> null)
    brand = normalizeInput(brand);
    model = normalizeInput(model);
    category = normalizeInput(category);
    condition = normalizeInput(condition);
    description = normalizeInput(description);

    try {
        // ✅ Refined Strict Fail-safe: Check Brand, Model, Condition, and Description (normalized)
        const existingResult = await pool.query(
            `SELECT id FROM components 
             WHERE LOWER(brand) IS NOT DISTINCT FROM LOWER($1) 
               AND LOWER(model) IS NOT DISTINCT FROM LOWER($2) 
               AND LOWER(condition) IS NOT DISTINCT FROM LOWER($3) 
               AND LOWER(description) IS NOT DISTINCT FROM LOWER($4)`,
            [brand, model, condition, description]
        );

        console.log(`[Duplicate Check] Brand: ${brand}, Model: ${model}, Desc: ${description}, Cond: ${condition} - Match Found: ${existingResult.rows.length > 0}`);

        if (existingResult.rows.length > 0) {
            return res.status(409).json({ 
                success: false, 
                message: "Duplicate Entry: A part with identical Brand, Model, Condition, and Description already exists." 
            });
        }

        const newComponent = await pool.query(
            `INSERT INTO components (brand, model, category, condition, description, stock_quantity, image_url) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [brand, model, category, condition, description, stock_quantity || 1, image_url || null] 
        );
        res.status(201).json({ success: true, component: newComponent.rows[0] });
    } catch (err) {
        console.error("Error adding component:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const updateComponent = async (req, res) => {
    const { id } = req.params;
    let { brand, model, category, condition, description, stock_quantity, image_url } = req.body;
    
    // Normalize string inputs (trim + empty -> null)
    brand = normalizeInput(brand);
    model = normalizeInput(model);
    category = normalizeInput(category);
    condition = normalizeInput(condition);
    description = normalizeInput(description);

    try {
        // ✅ Fail-safe: Prevent update from creating a duplicate of ANOTHER part (normalized)
        const existingResult = await pool.query(
            `SELECT id FROM components 
             WHERE LOWER(brand) IS NOT DISTINCT FROM LOWER($1) 
               AND LOWER(model) IS NOT DISTINCT FROM LOWER($2) 
               AND LOWER(condition) IS NOT DISTINCT FROM LOWER($3) 
               AND LOWER(description) IS NOT DISTINCT FROM LOWER($4)
               AND id != $5`,
            [brand, model, condition, description, id]
        );

        if (existingResult.rows.length > 0) {
            return res.status(409).json({ 
                success: false, 
                message: "Duplicate Update: Another part with identical Brand, Model, Condition, and Description already exists." 
            });
        }

        const updatedComponent = await pool.query(
            `UPDATE components SET brand = $1, model = $2, category = $3, condition = $4, description = $5, stock_quantity = $6, image_url = COALESCE($7, image_url) WHERE id = $8 RETURNING *`,
            [brand, model, category, condition, description, stock_quantity, image_url || null, id]
        );
        res.status(200).json({ success: true, component: updatedComponent.rows[0] });
    } catch (err) {
        console.error("Error updating component:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getAllComponents = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM components ORDER BY created_at DESC');
        res.status(200).json({ success: true, components: result.rows });
    } catch (err) {
        console.error("Error fetching all components:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteComponent = async (req, res) => {
    try {
        await pool.query('DELETE FROM components WHERE id = $1', [req.params.id]);
        res.status(200).json({ success: true, message: "Deleted" });
    } catch (err) {
        console.error("Error deleting component:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const addSupplierLink = async (req, res) => {
    const { id } = req.params;
    const { supplier_name, link_url } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO supplier_links (component_id, store_name, url) VALUES ($1, $2, $3) RETURNING id, component_id, store_name AS supplier_name, url AS link_url, price',
            [id, supplier_name, link_url]
        );
        res.status(201).json({ success: true, link: result.rows[0] });
    } catch (err) {
        console.error("Error adding supplier link:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const deleteSupplierLink = async (req, res) => {
    const { linkId } = req.params;
    try {
        await pool.query('DELETE FROM supplier_links WHERE id = $1', [linkId]);
        res.status(200).json({ success: true, message: "Link deleted" });
    } catch (err) {
        console.error("Error deleting supplier link:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
