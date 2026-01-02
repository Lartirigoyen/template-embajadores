# 🤝 CONTRIBUIR AL TEMPLATE - Lycsa Suite

¡Gracias por tu interés en mejorar el Template Embajadores!

## 📋 Antes de Contribuir

### ¿Qué se puede mejorar?

✅ **Bienvenido:**
- Correcciones de bugs
- Mejoras en la documentación
- Optimizaciones de performance
- Nuevos componentes UI del Design System
- Mejoras en helpers y utilidades
- Actualización de dependencias
- Ejemplos adicionales

❌ **No agregar:**
- Tablas de negocio o migraciones específicas
- Lógica de negocio específica de un proyecto
- Dependencias innecesarias
- Cambios que rompan la compatibilidad

## 🔧 Proceso de Contribución

### 1. Discutir el Cambio

Antes de hacer cambios grandes:
- Contactar al equipo de desarrollo
- Explicar el problema que resuelve
- Proponer la solución
- Obtener aprobación

### 2. Hacer el Cambio

```bash
# 1. Clonar el repo
git clone [repo-interno]

# 2. Crear branch
git checkout -b feature/mi-mejora

# 3. Hacer cambios
# ... tus modificaciones ...

# 4. Verificar calidad
npm run lint
npm run format:check
npm run type-check
npm run build

# 5. Commit
git commit -m "feat: descripción del cambio"

# 6. Push
git push origin feature/mi-mejora
```

### 3. Crear Pull Request

- Describir el cambio claramente
- Incluir ejemplos si aplica
- Mencionar si rompe compatibilidad
- Asignar reviewers del equipo

## 📝 Guía de Estilo

### TypeScript

```typescript
// ✅ Bueno
export async function uploadFile(params: UploadParams): Promise<Result> {
  // ...
}

// ❌ Evitar
export async function uploadFile(params: any): Promise<any> {
  // ...
}
```

### Componentes

```typescript
// ✅ Bueno - Componente documentado
/**
 * Botón del Design System Lycsa
 * @param variant - Estilo visual del botón
 * @param size - Tamaño del botón
 */
export const Button: React.FC<ButtonProps> = ({ ... }) => {
  // ...
}

// ❌ Evitar - Sin tipos ni documentación
export const Button = (props) => {
  // ...
}
```

### Nomenclatura

```typescript
// Archivos
Button.tsx          // Componentes React
formatDate.ts       // Utilities
UserTypes.ts        // Tipos

// Variables y funciones
const userName = '...';           // camelCase
const MAX_RETRIES = 3;           // UPPER_SNAKE_CASE para constantes
function getUserData() { ... }    // camelCase

// Componentes y tipos
type UserProfile = { ... };       // PascalCase
interface ButtonProps { ... }     // PascalCase
```

### Commits

Usar [Conventional Commits](https://www.conventionalcommits.org/):

```bash
# Nuevas características
feat: agregar componente Dropdown

# Correcciones
fix: corregir soft delete en helper

# Documentación
docs: actualizar README con ejemplo de S3

# Refactoring
refactor: simplificar lógica de conexión DB

# Performance
perf: optimizar query de listado

# Tests
test: agregar tests para Excel service

# Chores
chore: actualizar dependencias
```

## 🧪 Testing

Antes de enviar cambios:

```bash
# Verificar tipos
npm run type-check

# Verificar lint
npm run lint

# Verificar formato
npm run format:check

# Build
npm run build

# Test manual
npm run dev
```

## 📚 Documentación

### Actualizar README

Si tu cambio afecta el uso del template:
- Actualizar README.md
- Agregar ejemplos
- Documentar breaking changes

### Comentarios en Código

```typescript
// ✅ Bueno - Explica el "por qué"
/**
 * Usamos SuperJSON para serializar Dates y otros tipos especiales
 * que JSON estándar no soporta
 */
const transformer = superjson;

// ❌ Evitar - Explica el "qué" (obvio del código)
/**
 * Define el transformer
 */
const transformer = superjson;
```

## 🎨 Design System

### Agregar Nuevo Componente

Si agregas un componente al Design System:

1. **Crear el componente** en `src/ui/components/`
2. **Seguir el patrón** de componentes existentes
3. **Usar colores Lycsa** (verde, beige)
4. **Usar tipografía Aller**
5. **Incluir variantes** (sizes, variants)
6. **Documentar props** con comentarios
7. **Exportar** en `index.ts`
8. **Agregar ejemplo** en `page.tsx` (opcional)

```typescript
// Ejemplo de nuevo componente
export interface AlertProps {
  variant?: 'success' | 'error' | 'warning' | 'info';
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({
  variant = 'info',
  children,
}) => {
  // ... implementación siguiendo el estilo Lycsa
};
```

## 🔍 Code Review

### Lo que Buscamos

✅ **Aprobamos:**
- Código limpio y legible
- Type-safety completo
- Documentación clara
- Tests pasando
- Sin breaking changes innecesarios
- Consistente con el estilo del proyecto

❌ **Rechazamos:**
- Código sin tipos
- Sin documentación
- Breaks de compatibilidad sin justificar
- Dependencias innecesarias
- Lógica de negocio específica

## 🐛 Reportar Bugs

### Template para Bug Report

```markdown
## Descripción
[Descripción clara del bug]

## Pasos para Reproducir
1. ...
2. ...
3. ...

## Comportamiento Esperado
[Qué debería pasar]

## Comportamiento Actual
[Qué pasa realmente]

## Entorno
- Node: vX.X.X
- npm: vX.X.X
- OS: Windows/Mac/Linux

## Logs
```
[Pegar logs relevantes]
```

## Screenshots
[Si aplica]
```

## 💡 Sugerir Mejoras

### Template para Feature Request

```markdown
## Problema
[Qué problema resuelve]

## Solución Propuesta
[Cómo lo resolverías]

## Alternativas
[Otras opciones consideradas]

## Impacto
- [ ] Breaking change
- [ ] Nueva dependencia
- [ ] Afecta performance
- [ ] Requiere migración
```

## 🏆 Contribuidores

Agradecimientos especiales a todos los que mejoran este template:

- Equipo de Desarrollo Lycsa Suite
- Embajadores y Dev Citizens
- [Tu nombre podría estar aquí]

## 📞 Contacto

**Dudas sobre contribuciones:**
- Canal de Slack: #dev-embajadores
- Email: desarrollo@lycsa.com
- Documentación interna: [link]

---

**¡Juntos hacemos un mejor template!** 🚀
