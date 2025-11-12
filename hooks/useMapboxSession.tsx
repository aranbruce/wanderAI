"use client";

import { useState } from "react";

/**
 * Custom hook to manage Mapbox session tokens
 * Persists session across page refreshes using localStorage
 * Session expires after 30 minutes of inactivity
 */
export function useMapboxSession() {
  const getOrCreateSession = () => {
    if (typeof window === "undefined") return "";

    const STORAGE_KEY = "mapbox-session-token";
    const SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { token, timestamp } = JSON.parse(stored);
        // Check if token is still valid (less than 30 minutes old)
        if (Date.now() - timestamp < SESSION_DURATION) {
          return token;
        }
      }
    } catch (error) {
      console.warn("Failed to parse stored session token:", error);
    }

    // Generate new token
    const newToken =
      Math.random().toString(36).substring(2) + Date.now().toString(36);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          token: newToken,
          timestamp: Date.now(),
        }),
      );
    } catch (error) {
      console.warn("Failed to store session token:", error);
    }

    return newToken;
  };

  const [sessionToken, setSessionToken] = useState<string>(getOrCreateSession);

  const refreshSession = () => {
    if (typeof window === "undefined") return;

    const newToken =
      Math.random().toString(36).substring(2) + Date.now().toString(36);

    try {
      localStorage.setItem(
        "mapbox-session-token",
        JSON.stringify({
          token: newToken,
          timestamp: Date.now(),
        }),
      );
      setSessionToken(newToken);
    } catch (error) {
      console.warn("Failed to refresh session token:", error);
    }
  };

  return {
    sessionToken,
    refreshSession,
  };
}
