import Keycloak from 'keycloak-js';

// Configuración de Keycloak con login-required
export const keycloakConfig: Keycloak.KeycloakConfig = {
  url: process.env.NEXT_PUBLIC_KEYCLOAK_URL ?? '',
  realm: process.env.NEXT_PUBLIC_KEYCLOAK_REALM ?? '',
  clientId: process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID ?? '',
};

// Opciones de inicialización con login-required
export const keycloakInitOptions: Keycloak.KeycloakInitOptions = {
    onLoad: 'login-required' as const,
    checkLoginIframe: false,
    // PKCE para seguridad adicional
    pkceMethod: 'S256'
};

// Singleton de Keycloak para usar en toda la app
let keycloakInstance: Keycloak | null = null;

export function getKeycloakInstance(): Keycloak {
  if (typeof window === 'undefined') {
    throw new Error('Keycloak solo puede usarse en el cliente');
  }
  
  if (!keycloakInstance) {
    keycloakInstance = new Keycloak(keycloakConfig);
  }
  
  return keycloakInstance;
}