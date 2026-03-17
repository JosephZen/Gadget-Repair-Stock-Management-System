import express from 'express';
import { pool } from './db.js';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pkg;
const app = express();
const PORT = process.env.PORT || 3000;

// ✅ 1. TRUST PROXY
app.set('trust proxy', 1);

// ✅ 2. CORS (CRITICAL FIX)
// Old code allowed the Backend URL. New code allows Localhost (for dev) 
// or strictly uses the FRONTEND_URL variable (for Vercel).
app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = [
      "http://localhost:5173",
      "https://gadget-repair-stock-management-system-dyr9v53mb.vercel.app"
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) === -1) {
      // If the origin isn't in the list, check if it matches the ENV variable
      if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());

// ✅ 3. SECURE COOKIES
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // True on Render
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' needed for Vercel
    maxAge: 1000 * 60 * 60 * 24 
  }
}));

// ==========================================
// ROUTES
// ==========================================

// 1. Get a specific component by ID (This is what the QR scanner calls!)
app.get('/api/components/:id', async (req, res) => {
    const { id } = req.params;
    try {
        // Fetch the component details
        const componentResult = await pool.query(
            'SELECT * FROM components WHERE id = $1', 
            [id]
        );

        if (componentResult.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Component not found" });
        }

        // Fetch any supplier links attached to this component
        const linksResult = await pool.query(
            'SELECT * FROM supplier_links WHERE component_id = $1',
            [id]
        );

        res.status(200).json({
            success: true,
            component: componentResult.rows[0],
            links: linksResult.rows
        });

    } catch (err) {
        console.error("Error fetching component:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// 2. Add a new component
app.post('/api/components', async (req, res) => {
    const { brand, model, category, condition, description, stock_quantity, image_url } = req.body;
    
    try {
        const newComponent = await pool.query(
            `INSERT INTO components (brand, model, category, condition, description, stock_quantity, image_url) 
             VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            // ✅ FIX: Added || null to prevent "undefined" crashes
            [brand, model, category, condition, description, stock_quantity || 1, image_url || null] 
        );
        
        res.status(201).json({ success: true, component: newComponent.rows[0] });
    } catch (err) {
        console.error("Error adding component:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// READ: Get ALL components (For the inventory list)
app.get('/api/components', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM components ORDER BY created_at DESC');
        res.status(200).json({ success: true, components: result.rows });
    } catch (err) {
        console.error("Error fetching all components:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// DELETE: Remove a component
app.delete('/api/components/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM components WHERE id = $1', [req.params.id]);
        res.status(200).json({ success: true, message: "Deleted" });
    } catch (err) {
        console.error("Error deleting component:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});