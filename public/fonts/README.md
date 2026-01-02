# Tipografías Aller

Para que el Design System funcione correctamente con la tipografía Aller de Lycsa Suite, coloca los archivos de fuente en este directorio:

```
public/fonts/
  ├── Aller_Rg.ttf      # Aller Regular
  ├── Aller_Lt.ttf      # Aller Light
  └── Aller_Bd.ttf      # Aller Bold
```

Si no tienes acceso a las fuentes Aller, el sistema usará `system-ui` como fallback.

## Donde obtener las fuentes

Las fuentes Aller pueden ser obtenidas de:
- Repositorio interno de Lycsa Suite
- Sistema de diseño oficial de la empresa
- Contactar al equipo de diseño

## Formatos soportados

- `.ttf` (TrueType Font) - Recomendado
- `.woff` / `.woff2` (Web Open Font Format) - También compatible

Si usas `.woff` o `.woff2`, actualiza las rutas en `src/app/globals.css`.
