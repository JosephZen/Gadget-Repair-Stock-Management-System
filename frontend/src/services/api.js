import axios from 'axios';

const isProduction = import.meta.env.PROD; // Vite determines if this is a Live Vercel build vs Local Dev

const api = axios.create({
    baseURL: isProduction 
        ? 'https://gadget-repair-stock-management-system.onrender.com/api' 
        : 'http://localhost:3000/api',
    withCredentials: true // Crucial for sending/receiving session cookies securely
});

export default api;
