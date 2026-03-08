import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for saved user session
        const savedUser = localStorage.getItem('kag_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                const userData = { ...data, isGuest: false };
                setUser(userData);
                localStorage.setItem('kag_user', JSON.stringify(userData));
                return { success: true };
            } else {
                return { success: false, message: data.detail || 'Login failed' };
            }
        } catch (err) {
            return { success: false, message: 'Server error' };
        }
    };

    const register = async (username, password, role) => {
        try {
            const response = await fetch('http://localhost:8000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role }),
            });

            const data = await response.json();
            if (response.ok) {
                return { success: true };
            } else {
                return { success: false, message: data.detail || 'Registration failed' };
            }
        } catch (err) {
            return { success: false, message: 'Server error' };
        }
    };

    const loginAsGuest = () => {
        const guestUser = { id: null, username: 'Guest', isGuest: true };
        setUser(guestUser);
        localStorage.setItem('kag_user', JSON.stringify(guestUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('kag_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, register, loginAsGuest, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
