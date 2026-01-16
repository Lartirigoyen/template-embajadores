import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type Keycloak from 'keycloak-js';
import { checkAuthThunk, logoutThunk } from '../thunks/authThunks';

// Tipos para el estado de autenticación
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
  } | null;
  token: string | null;
  refreshToken: string | null;
  error: string | null;
}

// Estado inicial
const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,
  refreshToken: null,
  error: null,
};

// Slice de autenticación
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Acción cuando Keycloak se inicializa con éxito
    loginSuccess: (state, action: PayloadAction<{
      token: string;
      refreshToken: string;
      idToken?: string;
      tokenParsed: Keycloak.KeycloakTokenParsed;
    }>) => {
      const { token, refreshToken, tokenParsed } = action.payload;
      
      state.isAuthenticated = true;
      state.isLoading = false;
      state.token = token;
      state.refreshToken = refreshToken;
      state.user = {
        id: tokenParsed.sub || '',
        username: tokenParsed.preferred_username || '',
        email: tokenParsed.email || '',
        firstName: tokenParsed.given_name || '',
        lastName: tokenParsed.family_name || '',
        roles: tokenParsed.realm_access?.roles || [],
      };
      state.error = null;
    },
    
    // Acción cuando se actualiza el token (refresh)
    tokenRefreshed: (state, action: PayloadAction<{
      token: string;
      refreshToken: string;
    }>) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
    
    // Acción cuando el usuario cierra sesión
    logout: (state) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = null;
    },
    
    // Acción cuando hay un error de autenticación
    authError: (state, action: PayloadAction<string>) => {
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = action.payload;
    },
    
    // Acción para indicar que está cargando
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // checkAuthThunk
      .addCase(checkAuthThunk.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(checkAuthThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = action.payload?.authenticated || false;
        
        if (action.payload && action.payload.tokenParsed) {
          const { tokenParsed } = action.payload;
          state.token = action.payload.token;
          state.refreshToken = action.payload.refreshToken;
          state.user = {
            id: tokenParsed.sub || '',
            username: tokenParsed.preferred_username || '',
            email: tokenParsed.email || '',
            firstName: tokenParsed.given_name || '',
            lastName: tokenParsed.family_name || '',
            roles: tokenParsed.realm_access?.roles || [],
          };
        }
      })
      .addCase(checkAuthThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.error = action.payload as string || 'Error de autenticación';
      })
      
      // logoutThunk
      .addCase(logoutThunk.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.isLoading = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.error = null;
      });
  },
});

// Exportar acciones
export const {
  loginSuccess,
  tokenRefreshed,
  logout,
  authError,
  setLoading,
} = authSlice.actions;

// Selectores
export const selectAuth = (state: { auth: AuthState }) => state.auth;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectToken = (state: { auth: AuthState }) => state.auth.token;

// Exportar reducer
export default authSlice.reducer;
