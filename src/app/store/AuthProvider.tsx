'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from './hooks';
import { selectAuth } from './slices/authSlice';
import { checkAuthThunk } from './thunks/authThunks';

interface AuthProviderProps {
  children: React.ReactNode;
}

/**
 * AuthProvider - Componente que maneja la autenticación con Keycloak
 * 
 * Ejecuta el checkAuthThunk al montar el componente para verificar
 * si hay una sesión activa en Keycloak. Si no hay sesión, redirige
 * automáticamente al login (login-required).
 * 
 * Muestra un loader mientras se verifica la autenticación.
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector(selectAuth);

  useEffect(() => {
    // Verificar autenticación al montar el componente
    dispatch(checkAuthThunk());
  }, [dispatch]);

  // Mostrar loader mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-lycsa-verde-50 to-lycsa-beige-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-lycsa-verde-600 mb-4"></div>
          <p className="text-gray-600 font-aller">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no renderizar nada (login-required redirige automáticamente)
  if (!isAuthenticated) {
    return null;
  }

  // Usuario autenticado, renderizar children
  return <>{children}</>;
}
