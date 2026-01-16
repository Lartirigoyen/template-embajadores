// Exportaciones centralizadas del store
export { AuthProvider } from './AuthProvider';
export type { RootState, AppDispatch } from './store';
export { useAppDispatch, useAppSelector } from './hooks';

// Exportaciones del auth slice
export {
  loginSuccess,
  tokenRefreshed,
  logout,
  authError,
  setLoading,
  selectAuth,
  selectUser,
  selectIsAuthenticated,
  selectToken,
} from './slices/authSlice';
export type { AuthState } from './slices/authSlice';

// Thunks de autenticación
export { checkAuthThunk, logoutThunk } from './thunks/authThunks';

// Hooks personalizados
export { useKeycloakAuth } from './hooks/useKeycloakAuth';
