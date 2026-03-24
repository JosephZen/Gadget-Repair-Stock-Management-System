import express from 'express';
import { pool } from './db.js';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from "pg"; 

import authRoutes from './routes/authRoutes.js';
import componentRoutes from './routes/componentRoutes.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

dotenv.config();        

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
      "http://localhost:5174",
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

app.use('/api/auth', authRoutes);
app.use('/api/components', isAuthenticated, componentRoutes);

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});