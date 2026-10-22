import React, { createContext, useContext, useState } from 'react';


const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);
  const [toasts, setToasts] = useState([]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.setAttribute('data-theme', !darkMode ? 'dark' : 'light');
  };

  const showToast = (message, type = 'info', duration = 5000) => {
    const toast = {
      id: Date.now(),
      message,
      type,
      duration
    };

    setToasts(prev => [...prev, toast]);

    setTimeout(() => {
      removeToast(toast.id);
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const value = {
    darkMode,
    toggleDarkMode,
    toasts,
    showToast,
    removeToast
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};