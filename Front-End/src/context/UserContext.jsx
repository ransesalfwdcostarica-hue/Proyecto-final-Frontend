/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../Services/userService';
import toast from 'react-hot-toast';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (!token) {
            setLoading(false);
            return;
        }

        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch { /* ignored */ }
        }

        getCurrentUser()
            .then(freshUser => {
                if (freshUser && freshUser.id) {
                    localStorage.setItem('user', JSON.stringify(freshUser));
                    setUser(freshUser);
                } else {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    setUser(null);
                    toast.error('Sesión expirada. Inicia sesión nuevamente.');
                }
            })
            .catch(() => {
                console.warn('No se pudo verificar el token. Usando sesión local.');
            })
            .finally(() => setLoading(false));
    }, []);

    const login = (userData, token) => {
        if (token) localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const refreshUser = (updatedData) => {
        try {
            const stored = localStorage.getItem('user');
            const current = stored ? JSON.parse(stored) : {};
            const merged = { ...current, ...updatedData };
            localStorage.setItem('user', JSON.stringify(merged));
            setUser(merged);
        } catch {
            setUser(prev => ({ ...prev, ...updatedData }));
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, login, logout, refreshUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};
