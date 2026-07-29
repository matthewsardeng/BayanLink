import React, { createContext, useContext, useEffect, useState } from "react";

export type UserRole = "resident" | "official" | "admin";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  purok: string;
  role: UserRole;
  avatarUrl?: string;
};

type AuthContextType = {
  user: UserProfile | null;
  login: (email: string) => Promise<boolean>;
  signup: (name: string, email: string, purok: string) => Promise<UserProfile>;
  logout: () => void;
};

const STORAGE_KEY_AUTH = "bayanlink_user_auth_v1";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved user auth", e);
        }
      }
    }
    return null; // Default to public visitor
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY_AUTH);
      }
    }
  }, [user]);

  const login = async (email: string): Promise<boolean> => {
    // Simple authentication lookup / auto-login
    const mockUser: UserProfile = {
      id: "u-101",
      name: email.split("@")[0] || "Balibago Resident",
      email,
      purok: "Fields Avenue District",
      role: "resident",
    };
    setUser(mockUser);
    return true;
  };

  const signup = async (name: string, email: string, purok: string): Promise<UserProfile> => {
    const newUser: UserProfile = {
      id: `u-${Date.now()}`,
      name,
      email,
      purok,
      role: "resident",
    };
    setUser(newUser);
    return newUser;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
