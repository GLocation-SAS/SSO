"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import type { AuthProfileResponse } from "@/modules/gestion-usuarios/services/client-usuarios";
import { fetchCurrentAuthProfile } from "@/modules/gestion-usuarios/services/client-usuarios";

export type UserRole = "admin" | "user" | "docente";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  cargo?: string;
  sede?: string;
  avatar?: string;
  photoURL?: string;
}

export const DOCENTE_TEST_USER: AuthUser = {
  uid: "usr-docente-01",
  email: "docente@mineduc.gob.ec",
  displayName: "Juan Carlos Pérez",
  role: "docente",
  cargo: "Docente",
  sede: "Unidad Educativa Manuela Cañizares",
  avatar: "https://github.com/shadcn.png",
};

export const STANDARD_TEST_USER: AuthUser = {
  uid: "usr-standard-01",
  email: "prueba2@gmail.com",
  displayName: "Paula Rozo",
  role: "user",
  cargo: "Docente / Funcionario",
  sede: "Coordinación Zonal 9",
  avatar: "https://github.com/shadcn.png",
};

export const ADMIN_TEST_USER: AuthUser = {
  uid: "usr-admin-01",
  email: "admin@mineduc.gob.ec",
  displayName: "Paula Rozo",
  role: "admin",
  cargo: "Administradora General",
  sede: "Planta Central",
  avatar: "https://github.com/shadcn.png",
};

const STORAGE_KEY = "mineduc_sso_user";
const AUTH_EVENT_KEY = "mineduc_auth_changed";

export interface AuthContextType {
  user: any | null;
  profile: AuthProfileResponse | null;
  loading: boolean;
  isLoaded: boolean;
  isAdmin: boolean;
  isDocente: boolean;
  isStandardUser: boolean;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<AuthProfileResponse | null>;
  loginWithEmail: (email: string) => AuthUser;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  isLoaded: false,
  isAdmin: false,
  isDocente: false,
  isStandardUser: false,
  logout: async () => {},
  refreshProfile: async () => null,
  loginWithEmail: () => ADMIN_TEST_USER,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<AuthProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [mockUser, setMockUser] = useState<AuthUser | null>(null);

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
    // Leer mock user de localStorage si existe
    if (typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) {
          setMockUser(JSON.parse(raw));
        }
      } catch {
        // Ignorar
      }
    }

    const handleStorage = () => {
      if (typeof window !== "undefined") {
        try {
          const raw = window.localStorage.getItem(STORAGE_KEY);
          if (raw) {
            setMockUser(JSON.parse(raw));
          } else {
            setMockUser(null);
          }
        } catch {
          setMockUser(null);
        }
      }
    };

    window.addEventListener(AUTH_EVENT_KEY, handleStorage);
    window.addEventListener("storage", handleStorage);

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setFirebaseUser(currentUser);
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

    return () => {
      window.removeEventListener(AUTH_EVENT_KEY, handleStorage);
      window.removeEventListener("storage", handleStorage);
      unsubscribe();
    };
  }, []);

  const loginWithEmail = useCallback((email: string): AuthUser => {
    const cleanEmail = email.trim().toLowerCase();
    const newUser: AuthUser =
      cleanEmail === "docente@mineduc.gob.ec" || cleanEmail.includes("docente") || cleanEmail.includes("juancarlos")
        ? DOCENTE_TEST_USER
        : cleanEmail === "prueba2@gmail.com"
        ? STANDARD_TEST_USER
        : {
            ...ADMIN_TEST_USER,
            email: email.trim(),
          };

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      window.dispatchEvent(new Event(AUTH_EVENT_KEY));
    }
    setMockUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(async () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event(AUTH_EVENT_KEY));
    }
    setMockUser(null);
    try {
      await signOut(auth);
      setProfile(null);
    } catch (error) {
      console.error("Error al cerrar sesión en Firebase Auth:", error);
    }
  }, []);

  const isAdmin = profile?.isAdmin ?? (mockUser?.role === "admin");
  const isDocente =
    Boolean(profile?.isNotasUser) ||
    firebaseUser?.email?.includes("docente") ||
    mockUser?.role === "docente";
  const isStandardUser =
    (!isAdmin && !isDocente) || mockUser?.role === "user";

  const resolvedUser = firebaseUser
    ? {
        ...firebaseUser,
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName:
          firebaseUser.displayName ||
          (profile?.usuario ? `${profile.usuario.nombre} ${profile.usuario.apellidos}` : null) ||
          firebaseUser.email?.split("@")[0] ||
          "Usuario",
        role: isAdmin ? "admin" : isDocente ? "docente" : "user",
        cargo:
          profile?.usuario?.cargo ||
          (isAdmin ? "Administrador" : isDocente ? "Docente" : "Usuario Estándar"),
        sede: profile?.usuario?.sedes?.[0]?.sedeNombre || "Planta Central",
        avatar: firebaseUser.photoURL || "https://github.com/shadcn.png",
        photoURL: firebaseUser.photoURL,
      }
    : mockUser;

  return (
    <AuthContext.Provider
      value={{
        user: resolvedUser,
        profile,
        loading,
        isLoaded: !loading,
        isAdmin,
        isDocente,
        isStandardUser,
        logout,
        refreshProfile,
        loginWithEmail,
      }}
    >
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
