import { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await api.get('/auth/profile');
                if (data.success) {
                    setUser(data.user);
                }
            } catch (err) {
                console.log("Not authenticated", err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        if (data.success) {
            setUser(data.user);
            return true;
        }
        return false;
    };

    const register = async (username, email, password) => {
        const { data } = await api.post('/auth/register', { username, email, password });
        if (data.success) {
            setUser(data.user);
            return true;
        }
        return false;
    };

    const logout = async () => {
        await api.post('/auth/logout');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
