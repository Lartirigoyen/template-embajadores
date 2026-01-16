# Integración de Keycloak en React con Login Silencioso (Silent SSO)

**ACLARACIÓN:** esta integración se debe realizar luego de que se haya creado un client en Keycloak, desde el Portal LYCSA Suite o desde la consola de administración.

### 1. Instalar la librería `keycloak-js`
```cmd
npm install keycloak-js
```

### 2. Variables de entorno
En el archivo `.env` del proyecto configurar:  
```bash
VITE_KEYCLOAK_URL=https://auth.lartirigoyen.internal
VITE_KEYCLOAK_REALM=larti
VITE_KEYCLOAK_CLIENT=<id-client>
```

**Nota**: agregar las mismas variables en el archivo `vite-env.d.ts`.

### 3. Crear el archivo `config/keycloak.ts`
En este archivo se genera una instancia única de Keycloak para toda la aplicación:
```typescript
import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT
}

export const keycloakInstance = new Keycloak(keycloakConfig);
```

### 5. Layout
La aplicación debe contar con un layout que permita acceder a las rutas protegidas únicamente cuando exista un usuario autenticado. En caso de no haber una sesión activa, se debe redirigir a la pantalla de inicio de sesión.

***Ejemplo básico***:
```typescript
const AuthLayout = () => {
  const { isAuthenticated, loading, user } = useAppSelector((state) => state.authReducer);

  return (
    <>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          Cargando...
        </div>
      ) : !isAuthenticated || !user ? (
        (() => {
          return null;
        })()
      ) : (
        <div className="min-h-screen flex flex-col">
          <Nav user={user} />
          <div className="flex-1 flex flex-col justify-center">
            <Outlet />
          </div>
          <Footer />
        </div>
      )}
    </>
  );
}

export default AuthLayout;
```
**Nota**: en caso de que la aplicación cuente con una sola ruta, no sería necesario crear este layout y hacer lo anterior en el `App.tsx` o `main.tsx`.

Ejemplos de nombres para el layout pueden ser: `AuthLayout`, `ProtectedRoutesLayout`, `PrivatedRoutesLayout`.

## 6. Implementación usando Redux
**Nota:** este paso puede variar en función del gestor de estado (Redux, React Context, etc.) que se esté usando para la aplicación.

### 6.1 Crear `redux/slices/auth.slice.ts`:
```typescript
import { createSlice } from '@reduxjs/toolkit';
import type { User } from '../../interfaces/user.interface';
import { checkAuthThunk } from '../thunks/auth.thunks';

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: true,
  user: null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkAuthThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = action.payload?.authenticated || false;
        state.user = action.payload?.user as User || null;
      })
      .addCase(checkAuthThunk.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
  }
})
```

### 6.2 Crear ``redux/thunks/auth.thunks.ts``:
```typescript
import { createAsyncThunk } from "@reduxjs/toolkit"
import { keycloakInstance } from "../../config/keycloak";

export const checkAuthThunk = createAsyncThunk(
  "auth/checkAuth",
  async (
    _: void, 
    { rejectWithValue }
  ) => {
    try {
      const authenticated = await keycloakInstance.init({
        onLoad: 'login-required' as const,
        checkLoginIframe: false,
        pkceMethod: 'S256' as const
      });
      
      if (authenticated) {
        const userInfo = await keycloakInstance.loadUserInfo();
        return { authenticated: true, user: userInfo };
      } else {
        // Si no está autenticado, forzar login
        await keycloakInstance.login();
        return { authenticated: false, user: null };
      }
    } catch (err: any) {
      console.log(err);
    }
  }
);
```

### 6.3 Crear `redux/store.ts`:
```typescript
import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices/auth.slice";

export const store = configureStore({
  reducer: {
    authReducer: authSlice.reducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
```

### 6.4 Crear `redux/hooks.ts`:
```typescript
import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()
```

### 6.5 Usar el thunk en la aplicación:
En el archivo `App.tsx` o `main.tsx` usar `checkAuthThunk` para corroborar si hay una sesión iniciada en Keycloak.

```typescript
function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuthThunk());
  }, []);

  return (
    <Routes>
      ...
    </Routes>
  );
}

export default App;
```