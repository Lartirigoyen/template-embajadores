import { createAsyncThunk } from '@reduxjs/toolkit';
import { getKeycloakInstance, keycloakInitOptions } from '~/app/config/keycloak';

/**
 * Thunk para verificar la autenticación con Keycloak
 * Inicializa Keycloak con login-required y carga la información del usuario
 */
export const checkAuthThunk = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const keycloak = getKeycloakInstance();

      const authenticated = await keycloak.init(keycloakInitOptions);

      if (authenticated && keycloak.token && keycloak.refreshToken && keycloak.tokenParsed) {
        // Cargar información adicional del usuario
        const userInfo = await keycloak.loadUserInfo();

        // Configurar renovación automática del token
        keycloak.onTokenExpired = () => {
          keycloak
            .updateToken(30) // Renovar si expira en 30 segundos
            .catch(() => {
              console.error('Error al renovar el token');
              keycloak.logout();
            });
        };

        return {
          authenticated: true,
          token: keycloak.token,
          refreshToken: keycloak.refreshToken,
          idToken: keycloak.idToken,
          tokenParsed: keycloak.tokenParsed,
          userInfo,
        };
      } else {
        // Si no está autenticado, login-required redirigirá automáticamente
        await keycloak.login();
        return rejectWithValue('No autenticado');
      }
    } catch (error: any) {
      console.error('Error inicializando Keycloak:', error);
      return rejectWithValue(error.message || 'Error de autenticación');
    }
  }
);

/**
 * Thunk para cerrar sesión
 */
export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async () => {
    const keycloak = getKeycloakInstance();
    await keycloak.logout();
    return null;
  }
);
