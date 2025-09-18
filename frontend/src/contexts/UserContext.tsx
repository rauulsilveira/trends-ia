// src/contexts/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "user" | "admin";

export interface User {
  id?: number;
  name: string;
  role: UserRole;
  picture: string;
  facebookId?: string;
}

interface UserContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  
  // Hidrata usuário do localStorage
  useEffect(() => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (stored) setUser(JSON.parse(stored));
    } catch (err) {
      // ignora JSON inválido
    }
  }, []);
  
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};