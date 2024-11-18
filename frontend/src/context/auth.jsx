import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const authContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const clearAllCookies = () => {
    const allCookies = Cookies.get();
    Object.keys(allCookies).forEach((cookie) => {
      Cookies.remove(cookie);
    });
  };

  const LogOut = () => {
    clearAllCookies();
    navigate("/auth");
  };

  const authenticate = () => {
    const authToken = Cookies.get("authToken");
    const username = Cookies.get("username");

    if (!(authToken && username)) LogOut();
  };

  const isAuthenticated = () => {
    const authToken = Cookies.get("authToken");
    const username = Cookies.get("username");

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
