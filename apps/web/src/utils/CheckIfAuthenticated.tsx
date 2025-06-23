"use client";

import { jwtDecode } from "jwt-decode";
import { LOCAL_STORAGE } from "./constants";

export const CheckIfAuthenticated = () => {
  try {
    const token = localStorage.getItem(LOCAL_STORAGE.JWT_TOKEN);

    if (!token) {
      return false;
    }

    // Check if token is a valid JWT format (has three parts separated by dots)
    if (token.split('.').length !== 3) {
      localStorage.removeItem(LOCAL_STORAGE.JWT_TOKEN);
      return false;
    }

    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    if (decodedToken?.exp && decodedToken.exp < currentTime) {
      localStorage.removeItem(LOCAL_STORAGE.JWT_TOKEN);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Token validation error:", error);
    // Clear invalid token
    localStorage.removeItem(LOCAL_STORAGE.JWT_TOKEN);
    return false;
  }
};