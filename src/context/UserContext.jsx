import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);

            // Sync with backend to get latest data (including avatar)
            fetch(`http://localhost:3001/usuarios/${parsedUser.id}`)
                .then(res => res.json())
                .then(latestUser => {
                    if (latestUser && latestUser.id) {
                        localStorage.setItem('user', JSON.stringify(latestUser));
                        setUser(latestUser);
                    }
                })
                .catch(err => console.error("Sync error:", err));
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('user');
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
        <UserContext.Provider value={{ user, setUser, login, logout, refreshUser }}>
            {children}
        </UserContext.Provider>
    );
};
