import React, { useState } from 'react';
import AuthContext from './AuthContextValue';

const AuthProvider = ({ children }) => {
  // Inicializa el estado leyendo de localStorage
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("userName");
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    return storedUser ? { userName: storedUser, isAdmin } : null;
  });

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

export default AuthProvider;
