import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const login = async (email, password, role) => {
    try {
      const userData = await authService.login(email, password, role);
      setUser(userData);
      return userData;
    } catch (error) {
      throw error;
    }
  };

  const registerPatient = async (userData) => {
    try {
      const newPatient = await authService.registerPatient(userData);
      return newPatient;
    } catch (error) {
      throw error;
    }
  };

  const registerDoctor = async (userData) => {
    try {
      const newDoctor = await authService.registerDoctor(userData);
      return newDoctor;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    login,
    registerPatient,
    registerDoctor,
    logout,
    isAuthenticated: !!user,
    hasRole: (role) => user?.role === role,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};