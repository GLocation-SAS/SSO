"use client";

import { useEffect, useState, useCallback } from "react";
import { getNotasSession } from "../services/notas-client";
import type { NotasUserContext } from "../types/notas";

export interface UseNotasSessionState {
  notasUser: NotasUserContext | null;
  loading: boolean;
  error: string | null;
  errorCode: string | null;
  refetch: () => Promise<void>;
}

export function useNotasSession(): UseNotasSessionState {
  const [notasUser, setNotasUser] = useState<NotasUserContext | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const fetchSession = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setErrorCode(null);
      const data = await getNotasSession();
      setNotasUser(data.user);
    } catch (err: any) {
      setError(err.message || "Error al verificar la sesión de Notas.");
      setErrorCode(err.code || "UNKNOWN_ERROR");
      setNotasUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  return {
    notasUser,
    loading,
    error,
    errorCode,
    refetch: fetchSession,
  };
}
