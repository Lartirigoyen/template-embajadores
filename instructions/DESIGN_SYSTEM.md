# Lycsa Suite - Guía de Diseño y Sistema de Componentes

## 📋 Tabla de Contenidos
1. [Introducción](#introducción)
2. [Colores](#colores)
3. [Tipografía](#tipografía)
4. [Espaciado y Dimensiones](#espaciado-y-dimensiones)
5. [Componentes Base](#componentes-base)
6. [Patrones de Interacción](#patrones-de-interacción)
7. [Estados y Feedback](#estados-y-feedback)
8. [Animaciones y Transiciones](#animaciones-y-transiciones)
9. [Responsive Design](#responsive-design)
10. [Implementación con Tailwind CSS](#implementación-con-tailwind-css)

---

## Introducción

Este documento define el sistema de diseño de Lycsa Suite, una guía unificada para mantener consistencia visual y de experiencia de usuario a través de diferentes aplicaciones y tecnologías (Vue, React, Angular, React Native, etc.).

**Identidad Visual:**
- **Color Principal**: Verde institucional (#006149) - Representa crecimiento, confianza y naturaleza (sector agropecuario)
- **Color Secundario**: Beige (#d5c9b6) - Representa tierra, estabilidad y calidez
- **Tipografía**: Aller - Fuente moderna, limpia y profesional

**Principios de Diseño:**
- **Consistencia**: Mantener la misma apariencia y comportamiento en todos los productos
- **Accesibilidad**: Diseño inclusivo con contraste adecuado y navegación clara
- **Simplicidad**: Interfaces limpias y minimalistas
- **Profesionalismo**: Aspecto corporativo y confiable para el sector agropecuario

---

## Colores

### Paleta Principal (Colores Institucionales Lycsa)

```css
/* Primary (Verde institucional) */
--color-primary-50: #ebfef6;
--color-primary-100: #cefde7;
--color-primary-200: #a2f8d3;
--color-primary-300: #66efbe;
--color-primary-400: #29dea2;
--color-primary-500: #05c48b;
--color-primary-600: #00a072;
--color-primary-700: #00805e;
--color-primary-800: #006149; /* Verde institucional principal */
--color-primary-900: #015340;
--color-primary-950: #002f25;

/* Secondary (Beige institucional) */
--color-secondary-50: #f8f6f4;
--color-secondary-100: #f0ece4;
--color-secondary-200: #e0d7c8;
--color-secondary-300: #d5c9b6; /* Beige principal */
--color-secondary-400: #b69e81;
--color-secondary-500: #a78868;
--color-secondary-600: #9a775c;
--color-secondary-700: #80614e;
--color-secondary-800: #695143;
--color-secondary-900: #564338;
--color-secondary-950: #2d221d;

/* Grises */
--color-accent: #595857;            /* Gris para textos principales */
--color-gray-light: #f5f5f5;        /* Fondo general */
--color-gray-medium: #9ca3af;       /* Texto secundario */
--color-gray-dark: #374151;         /* Texto oscuro */
```

### Colores de Estado

```css
/* Success */
--color-success: #31C950;
--color-success-light: #DCFCE7;
--color-success-dark: #016630;

/* Warning */
--color-warning: #F0B13B;
--color-warning-light: #FEF9C2;
--color-warning-dark: #973C08;

/* Error */
--color-error: #FB2C36;
--color-error-light: #fee2e2;
--color-error-dark: #9F0712;

/* Info */
--color-info: #2B7FFF;
--color-info-light: #DBEAFE;
--color-info-dark: #193CB8;
```

### Uso de Colores

- **Primario (Verde #006149)**: Acciones principales, CTAs, navegación activa, botones primarios
- **Secundario (Beige #d5c9b6)**: Acciones secundarias, acentos, fondos suaves
- **Accent (Gris #595857)**: Textos principales, títulos, contenido
- **Grises**: Textos secundarios, bordes, fondos, deshabilitados

---

## Tipografía

### Fuente Principal: Aller

**Familia**: Aller  
**Pesos disponibles**: Light (300), Regular (400), Bold (700)  
**Fallback**: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial

```css
@font-face {
  font-family: "Aller Light";
  src: url("./fonts/Aller_Lt.ttf") format("truetype");
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Aller";
  src: url("./fonts/Aller_Rg.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Aller Bold";
  src: url("./fonts/Aller_Bd.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
```

### Escala Tipográfica

```
Títulos Grandes:       24px (1.5rem) - font-bold uppercase tracking-wide
Títulos Medianos:      20px (1.25rem) - font-bold capitalize
Títulos Pequeños:      18px (1.125rem) - font-bold
Cuerpo de Texto:       16px (1rem) - font-normal
Textos Secundarios:    14px (0.875rem) - font-normal
Textos Pequeños:       12px (0.75rem) - font-normal
Labels de Formulario:  14px (0.875rem) - font-bold
Botones:               14px (0.875rem) - font-bold uppercase tracking-wide
```

## Espaciado y Dimensiones

### Sistema de Espaciado (múltiplos de 4px)

```
xs:  4px  (0.25rem)
sm:  8px  (0.5rem)
md:  16px (1rem)
lg:  24px (1.5rem)
xl:  32px (2rem)
2xl: 48px (3rem)
3xl: 64px (4rem)
```

### Alturas Estándar de Componentes

```
Input pequeño:  32px (h-[32px])
Input normal:   42px (h-[42px])
Input grande:   52px (h-[52px])

Botón pequeño:  32px (h-[32px])
Botón normal:   42px (h-[42px])
Botón grande:   52px (h-[52px])
```

### Bordes y Radios

```
Border radius pequeño:  4px  (rounded)
Border radius medio:    8px  (rounded-lg)
Border radius grande:   12px (rounded-xl)
Border radius pill:     9999px (rounded-full)

Border width:           1px (border)
Border width grueso:    2px (border-2)
```

---

## Componentes Base

### 1. Botones

#### Variantes

**Primary (Acción principal)**
```
Fondo: bg-primary (#006149 - verde institucional)
Texto: text-white
Hover: bg-primary-600 (#00523e - verde más oscuro)
Sombra: shadow-md hover:shadow-lg
Padding: px-3 py-1 (sm), px-3 py-2 (md), px-4 py-3 (lg)
Border radius: rounded-md
Fuente: font-aller-bold uppercase tracking-wide
Transición: transition-all duration-200
Focus: focus:ring-2 focus:ring-primary focus:ring-offset-2
```

**Secondary (Acción secundaria)**
```
Fondo: bg-secondary (#d5c9b6 - beige institucional)
Texto: text-accent (#595857 - gris)
Hover: bg-secondary-600 (#b5ab9a - beige más oscuro)
Resto igual que Primary
```

**Outline (Acción terciaria)**
```
Fondo: transparent
Border: border-2 border-primary
Texto: text-primary
Hover: bg-primary text-white
Sin sombra por defecto
```

**Danger (Acciones destructivas)**
```
Fondo: bg-red-600
Texto: text-white
Hover: bg-red-700
Focus: focus:ring-red-500
```

#### Estados

- **Normal**: Colores definidos arriba
- **Hover**: Cambio de fondo + sombra más prominente
- **Active/Pressed**: Mismo que hover con ligera reducción de escala
- **Disabled**: opacity-50 + cursor-not-allowed
- **Loading**: Mostrar spinner, deshabilitar interacción

#### Ejemplo de Implementación (Tailwind)

```html
<!-- Botón Primary (Verde institucional) -->
<button class="inline-flex items-center justify-center px-3 py-2 text-sm h-10.5 bg-primary text-white font-aller-bold uppercase tracking-wide rounded-md shadow-md hover:bg-primary-600 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
  Guardar
</button>

<!-- Botón Secondary (Beige institucional) -->
<button class="inline-flex items-center justify-center px-3 py-2 text-sm h-10.5 bg-secondary text-accent font-aller-bold uppercase tracking-wide rounded-md shadow-md hover:bg-secondary-600 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2">
  Exportar
</button>

<!-- Botón Outline (Verde) -->
<button class="inline-flex items-center justify-center px-3 py-2 text-sm h-10.5 border-2 border-primary text-primary font-aller-bold uppercase tracking-wide rounded-md hover:bg-primary hover:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
  Cancelar
</button>
```

---

### 2. Inputs (Campos de Texto)

#### Estructura

```
Container: div con space-y-2
Label: font-aller-bold text-accent text-sm
  - Asterisco rojo (*) si es requerido
Input: border rounded-md px-3 py-2 h-[42px] font-aller
  - Normal: border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary
  - Error: border-red-300 focus:ring-2 focus:ring-red-500 focus:border-red-500
  - Disabled: bg-gray-100 cursor-not-allowed
Mensaje de error: text-red-500 text-sm font-aller
Hint: text-gray-500 text-sm font-aller
```

#### Estados

- **Normal**: Borde gris, fondo blanco
- **Focus**: Ring azul (ring-2 ring-primary), borde azul
- **Error**: Borde rojo, ring rojo al hacer focus, mensaje de error debajo
- **Disabled**: Fondo gris claro, cursor-not-allowed
- **Success**: Borde verde (opcional, para validación exitosa)

#### Ejemplo de Implementación

```html
<div class="space-y-2">
  <label for="email" class="block font-aller-bold text-accent text-sm">
    Correo Electrónico
    <span class="text-red-500">*</span>
  </label>
  <input 
    id="email" 
    type="email" 
    placeholder="usuario@ejemplo.com"
    class="w-full px-3 py-2 h-10.5 border border-gray-300 rounded-md font-aller transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
  />
  <p class="text-gray-500 text-sm font-aller">Usa tu correo corporativo</p>
</div>

<!-- Input con error -->
<div class="space-y-2">
  <label for="email-error" class="block font-aller-bold text-accent text-sm">
    Correo Electrónico
    <span class="text-red-500">*</span>
  </label>
  <input 
    id="email-error" 
    type="email" 
    class="w-full px-3 py-2 h-10.5 border border-red-300 rounded-md font-aller focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
  />
  <p class="text-red-500 text-sm font-aller">El correo electrónico es inválido</p>
</div>
```

---

### 3. Cards (Tarjetas)

#### Estructura Base

```
Contenedor: bg-white rounded-xl shadow-md border border-gray-100
  - Con hover: hover:shadow-lg transition-shadow duration-200 cursor-pointer
Header (opcional): px-6 py-4 border-b border-gray-100
Body: p-6 (normal), p-4 (sm), p-8 (lg)
Footer (opcional): px-6 py-4 border-t border-gray-100 bg-gray-50
```

#### Variantes de Sombra

```
Sin sombra: shadow-none
Sombra pequeña: shadow-sm
Sombra media: shadow-md (default)
Sombra grande: shadow-lg
```

#### Cards Especiales

**Card con Gradiente (KPI)**
```html
<!-- Ejemplo con verde institucional -->
<div class="bg-linear-to-r from-green-50 to-green-100 border-green-200 rounded-xl shadow-md p-6">
  <div class="flex items-center">
    <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
      <!-- Icono SVG en blanco -->
    </div>
    <div class="ml-4">
      <p class="text-sm font-aller text-gray-600">Total Órdenes</p>
      <p class="text-2xl font-aller-bold text-accent">150</p>
    </div>
  </div>
</div>
```

Colores de gradiente disponibles:
- Verde (institucional): `from-green-50 to-green-100 border-green-200` con icono `bg-primary`
- Amarillo: `from-yellow-50 to-yellow-100 border-yellow-200` con icono `bg-yellow-500`
- Azul: `from-blue-50 to-blue-100 border-blue-200` con icono `bg-blue-500`
- Rojo: `from-red-50 to-red-100 border-red-200` con icono `bg-red-500`

---

### 4. Badges (Insignias de Estado)

#### Estructura

```
Contenedor: inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-aller-bold uppercase tracking-wide
Dot indicator: h-2 w-2 rounded-full mr-1.5
```

#### Colores por Estado

```
Pendiente (Amarillo):
  - Fondo: bg-yellow-100
  - Texto: text-yellow-800
  - Dot: bg-yellow-400

En Proceso (Azul):
  - Fondo: bg-blue-100
  - Texto: text-blue-800
  - Dot: bg-blue-400

Completado (Verde):
  - Fondo: bg-green-100
  - Texto: text-green-800
  - Dot: bg-green-400

Error (Rojo):
  - Fondo: bg-red-100
  - Texto: text-red-800
  - Dot: bg-red-400

Inactivo (Gris):
  - Fondo: bg-gray-100
  - Texto: text-gray-800
  - Dot: bg-gray-400
```

#### Ejemplo de Implementación

```html
<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-aller-bold uppercase tracking-wide bg-green-100 text-green-800">
  <span class="mr-1.5 h-2 w-2 rounded-full bg-green-400"></span>
  Completado
</span>
```

---

### 5. Modales (Diálogos)

#### Estructura

```
Overlay: fixed inset-0 bg-gray-500 bg-opacity-75 z-40
Modal: fixed inset-0 z-50 overflow-y-auto
Container: flex min-h-full items-center justify-center p-4
Content: bg-white rounded-xl shadow-xl max-w-md w-full
  - Header: p-6 border-b border-gray-100
  - Body: p-6
  - Footer: p-6 border-t border-gray-100 bg-gray-50
```

#### Animaciones de Entrada/Salida

```
Enter:
  - Overlay: opacity-0 → opacity-100 (duration-300)
  - Modal: opacity-0 scale-95 → opacity-100 scale-100 (duration-300)

Leave:
  - Overlay: opacity-100 → opacity-0 (duration-200)
  - Modal: opacity-100 scale-100 → opacity-0 scale-95 (duration-200)
```

#### Ejemplo

```html
<!-- Overlay -->
<div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity z-40"></div>

<!-- Modal Container -->
<div class="fixed inset-0 z-50 overflow-y-auto">
  <div class="flex min-h-full items-center justify-center p-4">
    <!-- Modal Content -->
    <div class="bg-white rounded-xl shadow-xl max-w-md w-full">
      <!-- Header -->
      <div class="p-6 border-b border-gray-100">
        <h3 class="text-xl font-aller-bold text-accent">Título del Modal</h3>
      </div>
      
      <!-- Body -->
      <div class="p-6">
        <p class="font-aller text-accent">Contenido del modal...</p>
      </div>
      
      <!-- Footer -->
      <div class="p-6 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
        <button class="btn-outline">Cancelar</button>
        <button class="btn-primary">Confirmar</button>
      </div>
    </div>
  </div>
</div>
```

---

### 6. Tablas

#### Estructura

```
Container: overflow-x-auto
Table: min-w-full
  - Cabecera: bg-gray-50
    - Celdas: px-6 py-3 text-left text-xs font-aller-bold text-gray-500 uppercase tracking-wider
  - Cuerpo: divide-y divide-gray-200
    - Filas: hover:bg-gray-50 transition-colors
    - Celdas: px-6 py-4 font-aller
```

#### Ejemplo

```html
<div class="overflow-x-auto">
  <table class="min-w-full">
    <thead class="bg-gray-50">
      <tr>
        <th class="px-6 py-3 text-left text-xs font-aller-bold text-gray-500 uppercase tracking-wider">
          Nombre
        </th>
        <th class="px-6 py-3 text-left text-xs font-aller-bold text-gray-500 uppercase tracking-wider">
          Estado
        </th>
        <th class="px-6 py-3 text-left text-xs font-aller-bold text-gray-500 uppercase tracking-wider">
          Acciones
        </th>
      </tr>
    </thead>
    <tbody class="bg-white divide-y divide-gray-200">
      <tr class="hover:bg-gray-50 transition-colors">
        <td class="px-6 py-4 font-aller text-accent">Orden #001</td>
        <td class="px-6 py-4">
          <span class="badge-success">Completado</span>
        </td>
        <td class="px-6 py-4">
          <button class="text-primary hover:text-primary-600">Ver</button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## Patrones de Interacción

### 1. Notificaciones Toast

#### Tipos

- **Success**: Fondo blanco, icono verde, borde verde sutil
- **Error**: Fondo blanco, icono rojo, borde rojo sutil
- **Warning**: Fondo blanco, icono amarillo, borde amarillo sutil
- **Info**: Fondo blanco, icono azul, borde azul sutil

#### Estructura

```
Container: fixed top-4 right-4 z-[9999] max-w-sm w-full
Card: bg-white shadow-lg rounded-lg ring-1 ring-gray-300
Content: p-4 flex items-start
  - Icon: h-6 w-6 (color según tipo)
  - Message: text-sm font-aller text-gray-900
  - Close button: text-gray-400 hover:text-gray-500
Barra de progreso: h-1 bg-gray-200
  - Progreso: h-full transition-all duration-100 ease-linear (color según tipo)
```

#### Comportamiento

- **Posición**: Top-right corner
- **Duración por defecto**: 5 segundos
- **Animación entrada**: Slide from right + fade in (300ms)
- **Animación salida**: Fade out (100ms)
- **Barra de progreso**: Decrementa de 100% a 0% durante la duración
- **Auto-close**: Opcional, puede desactivarse para errores críticos
- **Stack**: Múltiples notificaciones se apilan verticalmente

#### Iconos SVG

```html
<!-- Success -->
<svg class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>

<!-- Error -->
<svg class="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>

<!-- Warning -->
<svg class="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.99-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
</svg>

<!-- Info -->
<svg class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
```

---

### 2. Loaders (Indicadores de Carga)

#### Spinner Circular

```html
<!-- Spinner pequeño (inline) -->
<div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>

<!-- Spinner mediano (botones) -->
<div class="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>

<!-- Spinner grande (páginas completas) -->
<div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
```

#### Skeleton Loaders

**Para Cards/KPIs:**
```html
<div class="animate-pulse flex items-center">
  <div class="w-12 h-12 bg-gray-300 rounded-lg"></div>
  <div class="ml-4 flex-1">
    <div class="h-4 bg-gray-300 rounded w-24 mb-2"></div>
    <div class="h-8 bg-gray-300 rounded w-16"></div>
  </div>
</div>
```

**Para Tablas:**
```html
<div class="animate-pulse space-y-4">
  <div class="h-10 bg-gray-200 rounded"></div>
  <div class="h-10 bg-gray-200 rounded"></div>
  <div class="h-10 bg-gray-200 rounded"></div>
  <div class="h-10 bg-gray-200 rounded"></div>
</div>
```

**Para Gráficos:**
```html
<div class="h-80 flex items-center justify-center">
  <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
</div>
```

#### Estados de Carga en Botones

```html
<!-- Botón con spinner -->
<button class="btn-primary inline-flex items-center" disabled>
  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
  Cargando...
</button>
```

---

### 3. Dropdowns y Selectores

#### Estructura

```
Trigger button: Similar a input, con icono de chevron
  - Normal: border-gray-300
  - Open: ring-2 ring-primary border-primary
  - Disabled: bg-gray-100 cursor-not-allowed

Dropdown menu: absolute z-50 mt-2 w-full
  - Container: bg-white rounded-lg shadow-lg border border-gray-200
  - Opciones: px-4 py-2 hover:bg-gray-50 cursor-pointer font-aller
  - Opción seleccionada: bg-primary-50 text-primary font-aller-bold
  - Scroll: max-h-60 overflow-y-auto

Search input (si aplica): px-4 py-2 border-b border-gray-200
```

#### Ejemplo

```html
<div class="relative">
  <!-- Trigger -->
  <button class="w-full px-3 py-2 h-10.5 border border-gray-300 rounded-md font-aller text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary">
    <span>Seleccionar opción</span>
    <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  <!-- Dropdown Menu -->
  <div class="absolute z-50 mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-200">
    <div class="max-h-60 overflow-y-auto">
      <div class="px-4 py-2 hover:bg-gray-50 cursor-pointer font-aller">Opción 1</div>
      <div class="px-4 py-2 bg-primary-50 text-primary font-aller-bold cursor-pointer">Opción 2 (seleccionada)</div>
      <div class="px-4 py-2 hover:bg-gray-50 cursor-pointer font-aller">Opción 3</div>
    </div>
  </div>
</div>
```

---

## Estados y Feedback

### Estados de Interacción

#### Hover
```
Duración: transition-all duration-200
Cambios comunes:
  - Botones: Cambio de fondo + sombra más pronunciada
  - Cards: shadow-md → shadow-lg
  - Links: Cambio de color
  - Filas de tabla: bg-transparent → bg-gray-50
```

#### Focus
```
Ring: focus:ring-2 focus:ring-primary focus:ring-offset-2
Outline: focus:outline-none
Borde: focus:border-primary (en inputs)
```

#### Active/Pressed
```
Escala: transform active:scale-95 (en botones)
Sombra reducida: shadow-lg → shadow-md
```

#### Disabled
```
Opacidad: opacity-50
Cursor: cursor-not-allowed
Sin interacciones: pointer-events-none
Fondo gris (en inputs): bg-gray-100
```

### Feedback Visual

#### Validación de Formularios

**Campo válido:**
```html
<input class="border-green-300 focus:ring-green-500 focus:border-green-500" />
<p class="text-green-600 text-sm">✓ Correo válido</p>
```

**Campo inválido:**
```html
<input class="border-red-300 focus:ring-red-500 focus:border-red-500" />
<p class="text-red-500 text-sm">✗ El correo es requerido</p>
```

#### Progreso y Cargas

**Barra de progreso:**
```html
<div class="w-full bg-gray-200 rounded-full h-2">
  <div class="bg-primary h-2 rounded-full transition-all duration-300" style="width: 65%"></div>
</div>
```

**Barra de progreso con estados:**
```html
<!-- Success -->
<div class="bg-green-500 h-2 rounded-full" style="width: 100%"></div>

<!-- Warning -->
<div class="bg-yellow-400 h-2 rounded-full" style="width: 50%"></div>

<!-- Error -->
<div class="bg-red-500 h-2 rounded-full" style="width: 25%"></div>
```

---

## Animaciones y Transiciones

### Duración Estándar

```css
/* Rápidas (micro-interacciones) */
--duration-fast: 100ms

/* Normal (la mayoría de transiciones) */
--duration-normal: 200ms

/* Lentas (animaciones complejas) */
--duration-slow: 300ms

/* Muy lentas (entrada de modales, páginas) */
--duration-slower: 500ms
```

### Easing Functions

```css
/* Por defecto */
ease-out: cubic-bezier(0, 0, 0.2, 1)

/* Suave */
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)

/* Rápido al inicio */
ease-in: cubic-bezier(0.4, 0, 1, 1)

/* Lineal (barras de progreso) */
linear: linear
```

### Transiciones Comunes

```css
/* Cambios de color */
transition: color 200ms ease-out, background-color 200ms ease-out, border-color 200ms ease-out;

/* Cambios de tamaño/posición */
transition: transform 200ms ease-out;

/* Opacidad */
transition: opacity 200ms ease-out;

/* Todo */
transition: all 200ms ease-out;
```

### Animaciones Especiales

**Fade In:**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
/* Uso: animate-fade-in duration-300 */
```

**Slide In (desde derecha):**
```css
@keyframes slideInRight {
  from { 
    opacity: 0;
    transform: translateX(2rem);
  }
  to { 
    opacity: 1;
    transform: translateX(0);
  }
}
```

**Pulse (para loaders):**
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
/* Uso: animate-pulse */
```

**Spin (para spinners):**
```css
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
/* Uso: animate-spin */
```

---

## Responsive Design

### Breakpoints

```css
/* Mobile first approach */
sm:  640px  (tablet pequeña)
md:  768px  (tablet)
lg:  1024px (desktop pequeño)
xl:  1280px (desktop)
2xl: 1536px (desktop grande)
```

### Patrones Responsive

#### Grid de Cards

```html
<!-- 1 columna en móvil, 2 en tablet, 3 en desktop, 4 en desktop grande -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
  <!-- Cards aquí -->
</div>
```

#### Grid de KPIs

```html
<!-- 1 columna en móvil, 2 en tablet, 3 en desktop -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <!-- KPIs aquí -->
</div>
```

#### Grid de Gráficos

```html
<!-- 1 columna en móvil y tablet, 2 en desktop -->
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <!-- Gráficos aquí -->
</div>
```

#### Espaciado Responsive

```html
<!-- Padding que crece con el viewport -->
<div class="p-4 md:p-6 lg:p-8">

<!-- Gap que crece con el viewport -->
<div class="flex flex-col gap-3 md:gap-4 lg:gap-6">
```

#### Tipografía Responsive

```html
<!-- Texto que crece con el viewport -->
<h1 class="text-xl md:text-2xl lg:text-3xl font-aller-bold">

<!-- Tamaño de componentes responsive -->
<button class="h-8 sm:h-10.5 lg:h-13">
```

#### Ocultar/Mostrar por Breakpoint

```html
<!-- Visible solo en móvil -->
<div class="block lg:hidden">

<!-- Visible solo en desktop -->
<div class="hidden lg:block">

<!-- Menú móvil vs desktop -->
<div class="block md:hidden">Menú móvil</div>
<div class="hidden md:block">Menú desktop</div>
```

---

## Implementación con Tailwind CSS

### Configuración Base (Tailwind v4)

```css
/* src/assets/base.css */

/* 1) Importar Tailwind */
@import "tailwindcss";

/* 2) Definir fuentes */
@font-face {
  font-family: "Aller";
  src: url("./fonts/Aller_Rg.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Aller Bold";
  src: url("./fonts/Aller_Bd.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

/* 3) Tokens del tema */
@theme {
  --font-aller: "Aller", ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto;
  --font-sans: var(--font-aller);

  --color-primary: #2563eb;
  --color-primary-600: #1d4ed8;

  --color-secondary: #f97316;
  --color-secondary-600: #ea580c;

  --color-accent: #111827;
}

/* 4) Componentes reutilizables */
@layer components {
  .btn-primary {
    @apply bg-primary text-white px-6 py-3 rounded-lg font-aller font-bold text-sm uppercase tracking-wide hover:bg-primary-600 transition-colors duration-200 shadow-md hover:shadow-lg;
  }

  .btn-secondary {
    @apply bg-secondary text-accent px-6 py-3 rounded-lg font-aller font-bold text-sm uppercase tracking-wide hover:bg-secondary-600 transition-colors duration-200 shadow-md hover:shadow-lg;
  }

  .btn-outline {
    @apply border-2 border-primary text-primary px-6 py-3 rounded-lg font-aller font-bold text-sm uppercase tracking-wide hover:bg-primary hover:text-white transition-colors duration-200;
  }

  .input-field {
    @apply border border-gray-300 rounded-lg px-4 py-3 font-aller focus:ring-2 focus:ring-primary focus:border-transparent;
  }

  .card {
    @apply bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden;
  }

  .title-primary {
    @apply font-aller font-bold text-primary text-2xl uppercase tracking-wide;
  }

  .title-secondary {
    @apply font-aller font-bold text-accent text-xl capitalize;
  }

  .text-body {
    @apply font-aller text-accent text-base;
  }
}

/* 5) Estilos base */
@layer base {
  body {
    @apply font-aller text-accent bg-gray-50;
  }

  h1, h2, h3, h4, h5, h6 {
    @apply font-aller font-bold text-accent;
  }
}
```

---

## Checklist de Implementación

Cuando implementes este sistema de diseño en un nuevo proyecto, verifica:

### ✅ Configuración Inicial
- [ ] Instalar y configurar Tailwind CSS
- [ ] Agregar fuentes Aller (Regular y Bold)
- [ ] Configurar colores personalizados (primary, secondary, accent)
- [ ] Definir tokens de diseño (@theme)
- [ ] Crear clases de componentes base (@layer components)

### ✅ Componentes Base
- [ ] Botones (primary, secondary, outline, danger)
- [ ] Inputs con validación
- [ ] Cards con variantes
- [ ] Badges de estado
- [ ] Modales
- [ ] Tablas

### ✅ Patrones de Interacción
- [ ] Sistema de notificaciones toast
- [ ] Loaders (spinner, skeleton)
- [ ] Dropdowns/selectores
- [ ] Validación de formularios

### ✅ Responsive
- [ ] Breakpoints configurados
- [ ] Grid responsive para layouts
- [ ] Tipografía responsive
- [ ] Componentes adaptativos

### ✅ Accesibilidad
- [ ] Contraste de colores WCAG AA
- [ ] Estados de focus visibles
- [ ] Navegación por teclado
- [ ] Labels y ARIA attributes
- [ ] Textos alternativos en iconos

---

## Recursos Adicionales

### Fuentes
- **Aller Light (300)**: Para descripciones
- **Aller Regular (400)**: Para textos de cuerpo, labels
- **Aller Bold (700)**: Para títulos, botones, navegación, labels importantes

### Iconografía
- **Tabler Icons**: https://tabler.io/icons (usado en los ejemplos)
- **Peso**: stroke-width="2" (consistente en todos los iconos)
- **Tamaños comunes**: w-4 h-4 (16px), w-5 h-5 (20px), w-6 h-6 (24px)

### Herramientas de Desarrollo
- **Tailwind CSS IntelliSense**: Extensión para VS Code
- **Tailwind CSS Playground**: https://play.tailwindcss.com/
- **Color Picker**: Para validar contraste WCAG

---

## Contacto y Mantenimiento

Este sistema de diseño es un documento vivo. Para sugerencias, correcciones o extensiones, contactar al equipo de diseño de Lycsa Suite.

**Versión**: 1.0  
**Última actualización**: Noviembre 2025  
**Mantenido por**: Equipo de Frontend Lycsa Suite

---

## Ejemplos de Implementación

### Vue 3 Example

```vue
<template>
  <button 
    :class="buttonClasses" 
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'outline', 'danger'].includes(v)
  },
  disabled: Boolean
})

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center font-aller-bold uppercase tracking-wide transition-all duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-600 focus:ring-primary shadow-md hover:shadow-lg',
    secondary: 'bg-secondary text-accent hover:bg-secondary-600 focus:ring-secondary shadow-md hover:shadow-lg',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg'
  }
  
  const sizes = {
    sm: 'px-3 py-1 text-xs h-[32px]',
    md: 'px-3 py-2 text-sm h-[42px]',
    lg: 'px-4 py-3 text-base h-[52px]'
  }
  
  const disabled = props.disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  return `${base} ${variants[props.variant]} ${sizes[props.size]} ${disabled}`
})
</script>
```

### React Example

```jsx
import React from 'react'

const Button = ({ 
  variant = 'primary',
  size = 'md',
  disabled = false, 
  children, 
  onClick 
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-aller-bold uppercase tracking-wide transition-all duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-600 focus:ring-primary shadow-md hover:shadow-lg',
    secondary: 'bg-secondary text-accent hover:bg-secondary-600 focus:ring-secondary shadow-md hover:shadow-lg',
    outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg'
  }
  
  const sizes = {
    sm: 'px-3 py-1 text-xs h-[32px]',
    md: 'px-3 py-2 text-sm h-[42px]',
    lg: 'px-4 py-3 text-base h-[52px]'
  }
  
  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : ''
  
  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClass}`
  
  return (
    <button 
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default Button
```

### Angular Example

```typescript
// button.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-button',
  template: `
    <button 
      [ngClass]="buttonClasses"
      [disabled]="disabled"
      (click)="handleClick($event)"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'outline' | 'danger' = 'primary'
  @Input() size: 'sm' | 'md' | 'lg' = 'md'
  @Input() disabled = false
  @Output() clicked = new EventEmitter<MouseEvent>()

  get buttonClasses(): string {
    const base = 'inline-flex items-center justify-center font-aller-bold uppercase tracking-wide transition-all duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2'
    
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-600 focus:ring-primary shadow-md hover:shadow-lg',
      secondary: 'bg-secondary text-accent hover:bg-secondary-600 focus:ring-secondary shadow-md hover:shadow-lg',
      outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white focus:ring-primary',
      danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-md hover:shadow-lg'
    }
    
    const sizes = {
      sm: 'px-3 py-1 text-xs h-[32px]',
      md: 'px-3 py-2 text-sm h-[42px]',
      lg: 'px-4 py-3 text-base h-[52px]'
    }
    
    const disabledClass = this.disabled ? 'opacity-50 cursor-not-allowed' : ''
    
    return `${base} ${variants[this.variant]} ${sizes[this.size]} ${disabledClass}`
  }

  handleClick(event: MouseEvent): void {
    if (!this.disabled) {
      this.clicked.emit(event)
    }
  }
}
```

---

## Notas Finales

Este sistema de diseño está diseñado para ser:
- **Escalable**: Fácil de extender con nuevos componentes
- **Mantenible**: Centralizado y documentado
- **Consistente**: Mismo look & feel en todos los productos
- **Accesible**: Cumple estándares WCAG AA
- **Responsive**: Mobile-first y adaptable
- **Framework-agnostic**: Puede implementarse en cualquier tecnología con Tailwind CSS
