import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

import { MOCK_USERS } from '../mockData';

const AuthContext = createContext(null);

// Configure Axios defaults
axios.defaults.baseURL = API_BASE_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      
      // Configure Axios interceptor for requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      const { user, token } = response.data;

      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { success: true };
    } catch (error) {
      // Fallback for demo / offline deployment mode
      if (!error.response || error.code === 'ERR_NETWORK') {
        const found = MOCK_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
        const demoUser = found || {
          user_id: 999,
          name: email.split('@')[0],
          email: email,
          phone: '+8801700000000',
          role: email.includes('admin') ? 'admin' : email.includes('owner') ? 'owner' : 'tenant'
        };
        const demoToken = 'demo-token-' + Date.now();

        setToken(demoToken);
        setUser(demoUser);
        localStorage.setItem('token', demoToken);
        localStorage.setItem('user', JSON.stringify(demoUser));
        return { success: true };
      }

      return {
        success: false,
        error: error.response?.data?.error || 'Failed to login. Please check credentials.'
      };
    }
  };

  const register = async (name, email, phone, password, role) => {
    try {
      const response = await axios.post('/auth/register', { name, email, phone, password, role });
      const { user, token } = response.data;

      setToken(token);
      setUser(user);
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      return { success: true };
    } catch (error) {
      // Fallback for demo / offline deployment mode
      if (!error.response || error.code === 'ERR_NETWORK') {
        const demoUser = {
          user_id: Date.now(),
          name,
          email,
          phone,
          role
        };
        const demoToken = 'demo-token-' + Date.now();

        setToken(demoToken);
        setUser(demoUser);
        localStorage.setItem('token', demoToken);
        localStorage.setItem('user', JSON.stringify(demoUser));
        return { success: true };
      }

      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed.'
      };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  const updateProfileState = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateProfileState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
