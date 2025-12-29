
"use client";

import { useRouter } from "next/navigation";
import React, { createContext, useContext, useState } from "react";

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string | null;
  organizationId: string;
  role: string;
  [key: string]: any;
}

export interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  signIn: (newToken: string, refreshToken:string, userData: User) => void;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  const signIn = (newToken: string, newRefreshToken:string, userData: User) => {
    setToken(newToken);
    setRefreshToken(newRefreshToken)
    setUser(userData);

    try {
      localStorage.setItem("token", String(newToken));
      localStorage.setItem('refreshToken', String(newRefreshToken))
      localStorage.setItem("user", JSON.stringify(userData));


    } catch (err) {
      // localStorage could be disabled in some environments — fail silently.
      console.error("Failed to persist auth to localStorage", err);
    }
  };

  const signOut = () => {
    setToken(null);
    setRefreshToken(null)
    setUser(null);

    try {
      localStorage.removeItem("token");
      localStorage.removeItem('refreshToken')
      localStorage.removeItem("user");
    } catch (err) {
      console.error("Failed to remove auth from localStorage", err);
    }

    router.push(`/auth/login`);
  };

  // Restore token and user data from localStorage on initial load
  React.useEffect(() => {
    try {
      const storedToken = localStorage.getItem("token");
      const storedRefreshToken = localStorage.getItem('refreshToken')
      const storedUser = localStorage.getItem("user");

      // Guard against the string "undefined" or "null"
      if (storedToken && storedToken !== "undefined" && storedToken !== "null") {
        setToken(storedToken);

      }

      if (storedRefreshToken && storedRefreshToken !== "undefined" && storedRefreshToken !== "null") {
        setRefreshToken(storedRefreshToken);
      }

      if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
        try {
          const parsed = JSON.parse(storedUser);
          // optional: validate shape before setUser(parsed)
          setUser(parsed);
        } catch (parseErr) {
          console.warn("Could not parse stored user, clearing invalid value.", parseErr);
          // clear corrupt value so we don't try to parse it again
          localStorage.removeItem("user");
        }
      }
    } catch (err) {
      console.error("Error reading auth from localStorage", err);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, refreshToken, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
