// frontend/src/context/AuthContext.js
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Inicializamos el estado leyendo de localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("userName");
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    return storedUser ? { userName: storedUser, isAdmin } : null;
  });
  //g
  const login = (userName, isAdmin = false) => {
    localStorage.setItem("userName", userName);
    if (isAdmin) {
      localStorage.setItem("isAdmin", "true");
    } else {
      localStorage.removeItem("isAdmin");
    }
    setUser({ userName, isAdmin });
  };

  const logout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("isAdmin");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
