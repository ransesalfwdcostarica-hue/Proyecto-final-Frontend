/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect */
import React, { createContext, useState, useEffect } from 'react';
import { BASE_URL } from '../Services/apiConfig';
import { getUserById } from '../Services/userService';
import toast from 'react-hot-toast'; 

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
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
            setLoading(false);
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
    };

    const refreshUser = (updatedData) => {
        try {
            const stored = localStorage.getItem('user');
            const currentUser = stored ? JSON.parse(stored) : {};
            const newUser = { ...currentUser, ...updatedData };
            localStorage.setItem('user', JSON.stringify(newUser));
            setUser(newUser);
        } catch (error) {
            console.error("Error refreshing user data in localStorage:", error);
            // Even if localStorage fails, update the state so the UI stays in sync
            setUser(prev => ({ ...prev, ...updatedData }));
        }
    };

    return (
        <UserContext.Provider value={{ user, setUser, login, logout, refreshUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};
