import express from 'express';
import { pool } from './db.js';
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from "pg"; 

import authRoutes from './routes/authRoutes.js';
import componentRoutes from './routes/componentRoutes.js';
import solderingRoutes from './routes/solderingRoutes.js';
import tutorialRoutes from './routes/tutorialRoutes.js';
import folderRoutes from './routes/folderRoutes.js';
import { isAuthenticated } from './middleware/authMiddleware.js';

dotenv.config();        

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ 1. TRUST PROXY
app.set('trust proxy', 1);

// ✅ 2. CORS (CRITICAL FIX)
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (
        origin.startsWith("http://localhost:") ||
        origin.endsWith("vercel.app") ||
        (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL)
    ) {
        return callback(null, true);
    }
    
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(express.json());

// ✅ Request Logging (DEBUG)
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

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