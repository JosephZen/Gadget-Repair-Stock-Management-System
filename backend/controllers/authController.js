import bcrypt from 'bcrypt';
import { pool } from '../db.js';

export const register = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await pool.query(
            'INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email',
            [username, email, hashedPassword]
        );
        req.session.user = newUser.rows[0];
        res.status(201).json({ success: true, user: newUser.rows[0] });
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userResult.rows.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        const user = userResult.rows[0];
        const match = await bcrypt.compare(password, user.password_hash);
        if (!match) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
        req.session.user = { id: user.id, username: user.username, email: user.email };
        res.status(200).json({ success: true, user: req.session.user });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const logout = (req, res) => {
    req.session.destroy(err => {
        if (err) return res.status(500).json({ success: false, message: "Could not log out" });
        res.clearCookie('connect.sid');
        res.status(200).json({ success: true, message: "Logged out" });
    });
};

export const getProfile = (req, res) => {
    if (req.session.user) {
        res.status(200).json({ success: true, user: req.session.user });
    } else {
        res.status(401).json({ success: false, message: 'Not authenticated' });
    }
};

export const updateProfile = async (req, res) => {
    if (!req.session.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
    const { username, password } = req.body;
    try {
        let updatedUser;
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const result = await pool.query(
                'UPDATE users SET username = $1, password_hash = $2 WHERE id = $3 RETURNING id, username, email',
                [username, hashedPassword, req.session.user.id]
            );
            updatedUser = result.rows[0];
        } else {
            const result = await pool.query(
                'UPDATE users SET username = $1 WHERE id = $2 RETURNING id, username, email',
                [username, req.session.user.id]
            );
            updatedUser = result.rows[0];
        }
        req.session.user = updatedUser;
        res.status(200).json({ success: true, user: updatedUser });
    } catch (err) {
        console.error("Profile update error:", err);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};
