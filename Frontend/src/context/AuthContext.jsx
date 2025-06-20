import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [showMessageBox, setShowMessageBox] = useState(false);

  // Custom message box
  const showMessage = (msg) => {
    setMessage(msg);
    setShowMessageBox(true);
    setTimeout(() => {
      setShowMessageBox(false);
      setMessage("");
    }, 3000);
  };

  useEffect(() => {
    if (token) {
      // In a real app, you might want to verify token validity with backend
      // For now, we'll assume it's valid if present
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", { email, password });
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      showMessage("Logged in successfully!");
      return true; // Indicate success
    } catch (err) {
      console.error("Login error:", err.response?.data?.message || err.message);
      showMessage(err.response?.data?.message || "Login failed!");
      return false; // Indicate failure
    }
  };

  const register = async (username, email, password) => {
    try {
      const res = await API.post("/auth/register", {
        username,
        email,
        password,
      });
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      showMessage("Registered successfully!");
      return true; // Indicate success
    } catch (err) {
      console.error(
        "Registration error:",
        err.response?.data?.message || err.message
      );
      showMessage(err.response?.data?.message || "Registration failed!");
      return false; // Indicate failure
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showMessage("Logged out successfully!");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, showMessage }}
    >
      {children}
      {showMessageBox && <div className="message-box">{message}</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
