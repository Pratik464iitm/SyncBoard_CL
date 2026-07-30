import React, { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../services/resources";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("syncboard_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("syncboard_token");
    if (!token) {
      setLoading(false);
      return;
    }
    getMe()
      .then(({ user }) => {
        setUser(user);
        localStorage.setItem("syncboard_user", JSON.stringify(user));
      })
      .catch(() => {
        localStorage.removeItem("syncboard_token");
        localStorage.removeItem("syncboard_user");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("syncboard_token", token);
    localStorage.setItem("syncboard_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("syncboard_token");
    localStorage.removeItem("syncboard_user");
    setUser(null);
  };

  const updateUserLocal = (userData) => {
    setUser(userData);
    localStorage.setItem("syncboard_user", JSON.stringify(userData));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUserLocal }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
