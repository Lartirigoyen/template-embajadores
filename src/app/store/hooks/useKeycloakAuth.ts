'use client';

import { useEffect } from 'react';
import { getKeycloakInstance, keycloakInitOptions } from '~/app/config/keycloak';
import { useAppDispatch, loginSuccess, logout, authError, setLoading } from '~/app/store';

/**
 * Hook para integrar Keycloak con Redux
 * Inicializa Keycloak y sincroniza el estado con Redux
 * 
 * Uso:
 * ```tsx
 * function MyComponent() {
 *   const { isAuthenticated, user, isLoading } = useAuth();
 *   
 *   if (isLoading) return <Loader />;
 *   if (!isAuthenticated) return null; // Redirige a login
 *   
 *   return <div>Hola {user?.firstName}</div>;
 * }
 * ```
 */
export function useKeycloakAuth() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const keycloak = getKeycloakInstance();
    
    dispatch(setLoading(true));

    keycloak
      .init(keycloakInitOptions)
      .then((authenticated) => {
        if (authenticated && keycloak.token && keycloak.refreshToken && keycloak.tokenParsed) {
          // Usuario autenticado correctamente
          dispatch(loginSuccess({
            token: keycloak.token,
            refreshToken: keycloak.refreshToken,
            idToken: keycloak.idToken,
            tokenParsed: keycloak.tokenParsed,
          }));

          // Configurar renovación automática del token
          keycloak.onTokenExpired = () => {
            keycloak
              .updateToken(30) // Renovar si expira en 30 segundos
              .then((refreshed) => {
                if (refreshed && keycloak.token && keycloak.refreshToken) {
                  dispatch(loginSuccess({
                    token: keycloak.token,
                    refreshToken: keycloak.refreshToken,
                    idToken: keycloak.idToken,
                    tokenParsed: keycloak.tokenParsed!,
                  }));
                }
              })
              .catch(() => {
                dispatch(authError('Error al renovar el token'));
                keycloak.logout();
              });
          };
        } else {
          // No autenticado (login-required redirigirá automáticamente)
          dispatch(setLoading(false));
        }
      })
      .catch((error) => {
        console.error('Error inicializando Keycloak:', error);
        dispatch(authError(error.message || 'Error de autenticación'));
      });

    // Cleanup
    return () => {
      keycloak.onTokenExpired = () => {};
    };
  }, [dispatch]);

  // Función para cerrar sesión
  const handleLogout = () => {
    const keycloak = getKeycloakInstance();
    dispatch(logout());
    keycloak.logout();
  };

  return { handleLogout };
}
