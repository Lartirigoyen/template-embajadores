# Store - Redux Toolkit con Keycloak

Configuración de Redux Toolkit para el manejo del estado global de la aplicación con integración de Keycloak para autenticación.

## Estructura

```
store/
├── index.ts              # Exportaciones centralizadas
├── store.ts              # Configuración del store
├── ReduxProvider.tsx     # Provider de Redux para App Router
├── AuthProvider.tsx      # Provider de autenticación con Keycloak
├── hooks.ts              # Hooks tipados (useAppDispatch, useAppSelector)
├── slices/
│   └── authSlice.ts      # Slice de autenticación con Keycloak
├── thunks/
│   └── authThunks.ts     # Thunks para autenticación (checkAuth, logout, refresh)
└── hooks/
    └── useKeycloakAuth.ts # Hook para integrar Keycloak con Redux (legacy)
```

## Configuración Inicial

### Variables de entorno requeridas

```env
NEXT_PUBLIC_KEYCLOAK_URL=https://auth.lartirigoyen.internal
NEXT_PUBLIC_KEYCLOAK_REALM=larti
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=tu-client-id
```

## Uso

### 1. Autenticación automática en layout

El `AuthProvider` se ejecuta automáticamente en el layout principal y verifica la sesión de Keycloak al cargar la aplicación:

```tsx
// src/app/layout.tsx
<ReduxProvider>
  <AuthProvider>  {/* ← Verifica autenticación automáticamente */}
    <TRPCProvider>
      {children}
    </TRPCProvider>
  </AuthProvider>
</ReduxProvider>
```

### 2. Acceder al estado de autenticación en componentes
```

### 2. Acceder al estado de autenticación en componentes

```tsx
'use client';

import { useAppSelector } from '~/app/store';
import { selectAuth } from '~/app/store';

function MyComponent() {
  const { user, isAuthenticated, isLoading } = useAppSelector(selectAuth);

  if (isLoading) return <div>Cargando...</div>;
  if (!isAuthenticated) return null;

  return (
    <div>
      <h1>Bienvenido {user?.firstName}</h1>
      <p>Email: {user?.email}</p>
      <p>Roles: {user?.roles.join(', ')}</p>
    </div>
  );
}
```

### 3. Cerrar sesión

```tsx
'use client';

import { useAppDispatch, logoutThunk } from '~/app/store';
import { Button } from '~/ui/components';

function LogoutButton() {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  return (
    <Button onClick={handleLogout}>
      Cerrar Sesión
    </Button>
  );
}
```

### 4. Verificar roles del usuario

```tsx
'use client';

import { useAppSelector, selectUser } from '~/app/store';

function AdminPanel() {
  const user = useAppSelector(selectUser);
  const isAdmin = user?.roles.includes('admin');

  if (!isAdmin) {
    return <div>No tienes permisos para acceder a esta sección</div>;
  }

  return <div>Panel de administración</div>;
}
```

### 5. Componente de ejemplo completo

Ver [src/app/components/UserProfile.tsx](../components/UserProfile.tsx) para un ejemplo completo de componente que usa autenticación.

## Thunks Disponibles

### checkAuthThunk
Verifica la autenticación con Keycloak al iniciar la aplicación:
```tsx
import { checkAuthThunk } from '~/app/store';

dispatch(checkAuthThunk());
```

### logoutThunk
Cierra la sesión en Keycloak:
```tsx
import { logoutThunk } from '~/app/store';

dispatch(logoutThunk());
```

### refreshTokenThunk
Refresca el token de autenticación (se ejecuta automáticamente):
```tsx
import { refreshTokenThunk } from '~/app/store';

dispatch(refreshTokenThunk());
```

## Mejoras implementadas

Mejoras respecto al documento CONFIG_KEYCLOAK_FRONT.md original:

1. **Adaptado a Next.js App Router**: Uso de `makeStore()` en lugar de exportar directamente el store
2. **AuthProvider separado**: Componente dedicado para manejar la autenticación
3. **Mejor manejo de errores**: Pantalla de error con opción de reintentar
4. **TypeScript estricto**: Tipos completos y tipado seguro
5. **Middleware configurado**: SerializableCheck configurado para Keycloak
6. **Thunks adicionales**: logout y refreshToken como thunks
7. **UI mejorada**: Loader con estilos del design system Lycsa
8. **Renovación automática de tokens**: Configurada en el thunk
9. **Documentación completa**: README con ejemplos de uso
10. **Componente de ejemplo**: UserProfile como referencia

## Estado de Autenticación

El `authSlice` maneja:

- **isAuthenticated**: Si el usuario está autenticado
- **isLoading**: Si está cargando la autenticación
- **user**: Datos del usuario (id, username, email, firstName, lastName, roles)
  - id: Subject del token (sub)
  - username: preferred_username
  - email: Email del usuario
  - firstName: given_name  
  - lastName: family_name
  - roles: realm_access.roles
- **token**: JWT token de Keycloak
- **refreshToken**: Token de renovación
- **error**: Mensajes de error
```

### 3. Agregar nuevos slices

```typescript
// store/slices/uiSlice.ts
import { createSlice } from '@reduxjs/toolkit';

export const uiSlice = createSlice({
  name: 'ui',
  initialState: { sidebarOpen: false },
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
  },
});
```

Luego agregar al store en `store.ts`:

```typescript
import uiReducer from './slices/uiSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      ui: uiReducer, // ← agregar aquí
    },
    // ...
  });
};
```

## Estado de Autenticación

El `authSlice` maneja:

- **isAuthenticated**: Si el usuario está autenticado
- **isLoading**: Si está cargando la autenticación
- **user**: Datos del usuario (id, username, email, firstName, lastName, roles)
- **token**: JWT token de Keycloak
- **refreshToken**: Token de renovación
- **error**: Mensajes de error

## Variables de entorno requeridas

```env
NEXT_PUBLIC_KEYCLOAK_URL=https://auth.example.com
NEXT_PUBLIC_KEYCLOAK_REALM=tu-realm
NEXT_PUBLIC_KEYCLOAK_CLIENT_ID=tu-client-id
```
