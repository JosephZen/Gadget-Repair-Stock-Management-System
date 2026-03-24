import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
    withCredentials: true // Crucial for sending/receiving session cookies
});

export default api;
