import React, { createContext, useState, useEffect } from "react";
import type { UserResponse } from "../client";

export interface AuthContextType {
  user: UserResponse | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isBuyer: boolean;
  isLoading: boolean;
  login: (token: string, user: UserResponse) => void;
  logout: () => void;
  setUser: (user: UserResponse) => void;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<UserResponse | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchCurrentUser = async (authToken: string) => {
    try {
      const res = await fetch("/api/v1/users/me", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.data) {
          setUserState(json.data);
          localStorage.setItem(USER_KEY, JSON.stringify(json.data));
        }
      }
    } catch (e) {
      console.error("Failed to fetch current user profile:", e);
    }
  };

  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);
        if (storedToken) {
          setTokenState(storedToken);
          if (storedUser) {
            setUserState(JSON.parse(storedUser));
          }
          await fetchCurrentUser(storedToken);
        }
      } catch (e) {
        console.error("Failed to restore authentication state:", e);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    restoreAuth();
  }, []);

  const login = (newToken: string, newUser: UserResponse) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setTokenState(newToken);
    setUserState(newUser);
    // Asynchronously refresh user profile from backend
    fetchCurrentUser(newToken);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setTokenState(null);
    setUserState(null);
  };

  const setUser = (newUser: UserResponse) => {
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setUserState(newUser);
  };

  const refreshUser = async () => {
    if (token) {
      await fetchCurrentUser(token);
    }
  };

  const isAuthenticated = Boolean(token && user);
  const isAdmin = user?.role === "admin";
  const isBuyer = user?.role === "buyer";

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        isAdmin,
        isBuyer,
        isLoading,
        login,
        logout,
        setUser,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
