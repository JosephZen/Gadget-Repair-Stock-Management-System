import axios from 'axios';

const isProduction = import.meta.env.PROD; // Vite determines if this is a Live Vercel build vs Local Dev

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:3000/api',
    withCredentials: true 
});

export default api;
