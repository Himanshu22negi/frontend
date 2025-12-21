import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('pms_auth_user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const data = await authService.login(email, password);
            // Assuming response contains { user: {...}, token: "..." } based on common patterns
            // Use debug/verification to confirm exact structure if needed. 
            // Based on Swagger, login returns { token, user } usually, let's assume standard
            // logic. If checking the mockApi return, it was just user.
            // Let's implement standard JWT handling.
            const { token, ...user } = data;
            setUser(user);
            localStorage.setItem('pms_auth_user', JSON.stringify(user));
            localStorage.setItem('token', token);
            return user;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('pms_auth_user');
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
