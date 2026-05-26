/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect } from 'react';
import { getUserById } from '../Services/userService';
import toast from 'react-hot-toast';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser && parsedUser.id) {
                    setUser(parsedUser);

                    // Sync with backend to get latest data (including avatar)
                    getUserById(parsedUser.id)
                        .then(latestUser => {
                            if (latestUser && latestUser.id) {
                                localStorage.setItem('user', JSON.stringify(latestUser));
                                setUser(latestUser);
                            } else {
                                localStorage.removeItem('user');
                                setUser(null);
                                toast.error("Sesión inválida o expirada. Inicia sesión nuevamente.");
                            }
                        })
                        .catch(err => {
                            console.error("Sync error, user might not exist anymore:", err);
                            localStorage.removeItem('user');
                            setUser(null);
                            toast.error("Sesión inválida o expirada. Inicia sesión nuevamente.");
                        })
                        .finally(() => {
                            setLoading(false);
                        });
                } else {
                    localStorage.removeItem('user');
                    setUser(null);
                    setLoading(false);
                }
            } catch (e) {
                console.error("Error parsing stored user data:", e);
                localStorage.removeItem('user');
                setUser(null);
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
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
