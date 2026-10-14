"use client";

import { useState, useEffect, useCallback } from "react";

export type UserRole = "admin" | "user" | "docente";

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: UserRole;
  cargo?: string;
  sede?: string;
  avatar?: string;
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
  email: "usuario@conecta.com",
  displayName: "Paula Rozo",
  role: "user",
  cargo: "Docente / Funcionario",
  sede: "Coordinación Zonal 9",
  avatar: "https://github.com/shadcn.png",
};

export const ADMIN_TEST_USER: AuthUser = {
  uid: "usr-admin-01",
  email: "admin@conecta.com",
  displayName: "Paula Rozo",
  role: "admin",
  cargo: "Administradora General",
  sede: "Planta Central",
  avatar: "https://github.com/shadcn.png",
};

const STORAGE_KEY = "mineduc_sso_user";
const AUTH_EVENT_KEY = "mineduc_auth_changed";

function getInitialUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
    // Si la ruta actual es del portal de notas/inicio, inicializar como docente
    if (window.location.pathname.startsWith("/inicio")) {
      return DOCENTE_TEST_USER;
    }
    // Si la ruta actual es del espacio personal, inicializar como usuario estándar por conveniencia
    if (window.location.pathname.startsWith("/mi-") || window.location.pathname.startsWith("/mis-")) {
      return STANDARD_TEST_USER;
    }
    return ADMIN_TEST_USER;
  } catch {
    return ADMIN_TEST_USER;
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setUser(getInitialUser());
    setIsLoaded(true);

    const handleStorage = () => {
      setUser(getInitialUser());
    };

    window.addEventListener(AUTH_EVENT_KEY, handleStorage);
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(AUTH_EVENT_KEY, handleStorage);
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const loginWithEmail = useCallback((email: string): AuthUser => {
    const cleanEmail = email.trim().toLowerCase();
    const isDocenteUser =
      cleanEmail === "docente@mineduc.gob.ec" ||
      cleanEmail.includes("docente") ||
      cleanEmail.includes("juancarlos");

    const isStandard =
      cleanEmail === "usuario@conecta.com" ||
      cleanEmail === "prueba2@gmail.com" ||
      cleanEmail.startsWith("usuario") ||
      cleanEmail.includes("usuario") ||
      cleanEmail.includes("estandar");

    const newUser: AuthUser = isDocenteUser
      ? DOCENTE_TEST_USER
      : isStandard
      ? {
          ...STANDARD_TEST_USER,
          email: cleanEmail,
        }
      : {
          ...ADMIN_TEST_USER,
          email: cleanEmail,
        };

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      window.dispatchEvent(new Event(AUTH_EVENT_KEY));
    }
    setUser(newUser);
    return newUser;
  }, []);

  const logout = useCallback(async () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event(AUTH_EVENT_KEY));
    }
    setUser(null);
  }, []);

  return {
    user,
    isLoaded,
    loginWithEmail,
    logout,
    isStandardUser: user?.role === "user",
    isDocente: user?.role === "docente",
    isAdmin: user?.role === "admin",
  };
}

