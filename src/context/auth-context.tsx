"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import type { AuthProfileResponse } from "@/modules/gestion-usuarios/services/client-usuarios";
import { fetchCurrentAuthProfile } from "@/modules/gestion-usuarios/services/client-usuarios";

export interface AuthContextType {
  user: User | null;
  profile: AuthProfileResponse | null;
  loading: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<AuthProfileResponse | null>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  logout: async () => {},
  refreshProfile: async () => null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async (): Promise<AuthProfileResponse | null> => {
    try {
      if (!auth.currentUser) {
        setProfile(null);
        return null;
      }
      const data = await fetchCurrentAuthProfile();
      setProfile(data);
      return data;
    } catch {
      setProfile(null);
      return null;
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const p = await fetchCurrentAuthProfile();
          setProfile(p);
        } catch {
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      setProfile(null);
    } catch (error) {
      console.error("Error al cerrar sesión en Firebase Auth:", error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, loading, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
}
