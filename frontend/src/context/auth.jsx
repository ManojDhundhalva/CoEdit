import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { clearLocalStorage } from "../utils/auth"

const authContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const LogOut = () => {
    clearLocalStorage();
    navigate("/auth");
  };

  const authenticate = () => {
    const authToken = localStorage.getItem("authToken");
    const username = localStorage.getItem("username");

    if (!(authToken && username)) LogOut();
  };

  const isAuthenticated = () => {
    const authToken = localStorage.getItem("authToken");
    const username = localStorage.getItem("username");

    return (authToken && username);
  };

  return (
    <authContext.Provider value={{ isAuthenticated, authenticate, LogOut }}>
      {children}
    </authContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(authContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};
