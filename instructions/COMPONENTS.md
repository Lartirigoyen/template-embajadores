# Guía de Componentes del Proyecto

## ⚠️ IMPORTANTE PARA MODELOS DE IA

**ESTE PROYECTO YA TIENE COMPONENTES IMPLEMENTADOS. NO CREAR NUEVOS COMPONENTES SI YA EXISTEN.**

Antes de crear cualquier componente nuevo, **SIEMPRE** verificar en este documento si ya existe. Todos los componentes listados aquí están completamente funcionales y deben ser utilizados.

---

## 📦 Componentes Disponibles

### Importación de Componentes

```tsx
// Importar componentes principales
import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Card,
  Link,
  Loader,
  Menu,
  MenuItem,
  Modal,
  Navbar,
  Pagination,
  Sidebar,
  SidebarNode,
  Skeleton,
  Stepper,
  Table,
  TablePagination,
  Tabs,
  Tile,
  ToastProvider,
  useToast,
  Typography,
} from '~/ui/components';

// Importar componentes de formularios
import {
  Checkbox,
  FileDropzone,
  Input,
  InputNumber,
  RadioGroup,
  Select,
  Switch,
  TextArea,
} from '~/ui/components/forms';
```

### Estilos y clases comunes

Todos los campos de formulario usan clases utilitarias para mantener consistencia:

- `.form-field-container`: contenedor base de campos (inputs, selects, textarea, radio, etc.)
- `.form-input-base`: estilos base de input (borde, padding, focus, etc.)
- `.form-input-typography`: solo tipografía (font-aller text-base text-accent)
- `.border-input-error` / `.border-input-normal`: borde de error o normal
- `.form-label-error`: pone el label en rojo si hay error
- `.form-box-plain`, `.form-box-boxed`, `.form-box-error`: variantes de caja para checkbox/radio

Ejemplo de uso en un input:
```tsx
<div className="form-field-container">
  <InputLabel text="Nombre" error={hasError} />
  <input className={`form-input-base ${hasError ? 'border-input-error' : 'border-input-normal'}`} />
</div>
```

---

## 🎨 Componentes de UI

### Accordion

Componente para mostrar secciones colapsables con soporte para múltiples items expandidos.

```tsx
// Accordion básico
const items = [
  { id: '1', summary: 'Sección 1', details: 'Contenido de la sección 1' },
  { id: '2', summary: 'Sección 2', details: 'Contenido de la sección 2' },
  { id: '3', summary: 'Sección 3', details: 'Contenido de la sección 3', disabled: true },
];

<Accordion items={items} />

// Accordion con múltiples secciones expandidas
<Accordion items={items} multiple defaultExpanded={['1', '2']} />

// Accordion controlado
const [expanded, setExpanded] = useState<string[]>(['1']);

<Accordion 
  items={items} 
  expanded={expanded} 
  onChange={setExpanded}
  variant="outlined"
  size="lg"
/>

// Con iconos personalizados
<Accordion 
  items={[
    { id: '1', summary: 'Configuración', details: <ConfigPanel />, icon: <IconSettings /> },
    { id: '2', summary: 'Usuario', details: <UserPanel />, icon: <IconUser /> },
  ]}
/>
```

**Props:**
- `items`: AccordionItem[] (requerido) - Array de items del accordion
- `defaultExpanded`: string | string[] - IDs expandidos por defecto (no controlado)
- `expanded`: string | string[] - IDs expandidos (controlado)
- `onChange`: (expandedIds: string[]) => void - Callback al cambiar estado
- `multiple`: boolean - Permitir múltiples secciones expandidas (default: false)
- `variant`: 'default' | 'outlined' | 'elevation' (default: 'default')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `className`: string - Clases adicionales

**AccordionItem:**
```tsx
interface AccordionItem {
  id: string;              // REQUERIDO: Identificador único
  summary: React.ReactNode; // REQUERIDO: Título/encabezado del item
  details: React.ReactNode; // REQUERIDO: Contenido expandible
  icon?: React.ReactNode;   // Ícono opcional
  disabled?: boolean;       // Deshabilitar item
}
```

---

### Alert

Componente para mostrar alertas con diferentes tipos y opción de cierre.

```tsx
// Alert simple
<Alert type="success" message="¡Éxito!" detail="Operación completada." />

// Alert con botón de cierre
const [showAlert, setShowAlert] = useState(true);

{showAlert && (
  <Alert 
    type="error" 
    message="Error" 
    detail="Algo salió mal."
    onClose={() => setShowAlert(false)} 
  />
)}
```

**Props:**
- `type`: 'success' | 'error' | 'warning' | 'info' (requerido)
- `message`: string - Título del alert
- `detail`: string - Descripción del alert
- `onClose`: () => void - Función para cerrar el alert (opcional)
- `classNameContainer`: string - Clases adicionales para el contenedor
- `classNameIcon`: string - Clases adicionales para el ícono
- `classNameMessage`: string - Clases adicionales para el mensaje
- `classNameDetail`: string - Clases adicionales para el detalle

---

### Avatar

Muestra avatares con imagen, iniciales o color de fondo.

```tsx
<Avatar name="Juan Pérez" size="md" />
<Avatar src={imageUrl} name="Usuario" size="lg" />
<Avatar name="A P" size="sm" color="secondary" />
```

**Props:**
- `name`: string (requerido) - Nombre para generar iniciales
- `description`: string - Descripción
. `positionName`: 'left' | 'right' - Posición del nombre
- `src`: string - URL de la imagen
- `size`: 'sm' | 'md' | 'lg' | 'xl'
- `color`: 'primary' | 'secondary' | 'gray' | 'accent'
- `onlyInitials`: boolean - Mostrar solo iniciales si hay imagen

---

### Badge

Etiquetas pequeñas para mostrar estados o categorías.

```tsx
<Badge variant="success">Activo</Badge>
<Badge variant="error" outlined>Error</Badge>
<Badge variant="info" size="lg">Información</Badge>
```

**Props:**
- `children`: React.ReactNode (requerido)
- `variant`: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info'
- `size`: 'xs' | 'sm' | 'md' | 'lg'
- `className`: string - Clases adicionales

---

### Breadcrumb

Componente de navegación jerárquica tipo "migas de pan".

```tsx
const breadcrumbItems = [
  { label: 'Inicio', href: '/' },
  { label: 'Productos', href: '/productos' },
  { label: 'Detalle', isCurrent: true },
];

<Breadcrumb items={breadcrumbItems} separator="/" />

// Con íconos y onClick
<Breadcrumb 
  items={[
    { label: 'Dashboard', icon: <IconHome />, onClick: () => navigate('/') },
    { label: 'Configuración', to: '/config' },
    { label: 'Perfil', isCurrent: true },
  ]}
  separator=">"
/>
```

**Props:**
- `items`: BreadcrumbItem[] (requerido) - Array de elementos de navegación
- `separator`: React.ReactNode | string - Separador entre elementos (default: '/')
- `className`: string - Clases CSS adicionales

**BreadcrumbItem:**
```tsx
interface BreadcrumbItem {
  label: string;
  icon?: React.ReactNode;
  href?: string;
  to?: string;
  onClick?: () => void;
  isCurrent?: boolean; // Marca el elemento actual (no clickeable)
}
```

---

### Button

Botones con múltiples variantes y colores.

```tsx
<Button 
  label="Guardar" 
  variant="contained" 
  color="primary" 
  onClick={handleSave} 
/>

<Button 
  icon={<IconTrash />} 
  variant="outline" 
  color="error"
  size="sm" 
/>

<Button 
  label="Cargando..." 
  loading={true}
  variant="contained"
  color="primary"
/>
```

**Props:**
- `variant`: 'contained' | 'outline' | 'text'
- `color`: 'primary' | 'secondary' | 'gray' | 'success' | 'warning' | 'info' | 'error'
- `size`: 'xs' | 'sm' | 'md' | 'lg'
- `label`: string
- `icon`: React.ReactNode
- `iconPosition`: 'left' | 'right'
- `loading`: boolean
- `fullWidth`: boolean
- `disabled`: boolean
- `className`: string
- `classNameLabel`: string - Clases adicionales para el label
- Extiende `React.ButtonHTMLAttributes<HTMLButtonElement>`

---

### Card

Contenedor con estilos para agrupar contenido, con soporte para título, subtítulo y footer.

```tsx
// Card simple
<Card>
  <p>Contenido del card...</p>
</Card>

// Card con título y subtítulo
<Card title="Título del Card" subtitle="Descripción opcional">
  <p>Contenido del card...</p>
</Card>

// Card con footer
<Card title="Usuarios" footer={<Button label="Ver más" />}>
  <Table data={data} columns={columns} />
</Card>
```

**Props:**
- `children`: React.ReactNode (requerido)
- `title`: string - Título del card
- `subtitle`: string - Subtítulo del card
- `footer`: React.ReactNode - Contenido del footer
- `classNameContainer`: string - Clases adicionales para el contenedor
- `classNameHeader`: string - Clases adicionales para el header
- `classNameTitle`: string - Clases adicionales para el título
- `classNameSubtitle`: string - Clases adicionales para el subtítulo
- `classNameFooter`: string - Clases adicionales para el footer

---

### Loader

Indicador de carga animado con soporte para texto y modo pantalla completa.

```tsx
// Loader simple
<Loader size="md" />

// Loader con texto
<Loader size="lg" color="primary" text="Cargando datos..." />

// Loader pantalla completa
<Loader size="xl" fullScreen text="Procesando..." />
```

**Props:**
- `size`: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
- `color`: 'primary' | 'secondary' | 'accent'
- `text`: string - Texto a mostrar debajo del loader
- `fullScreen`: boolean - Muestra el loader en pantalla completa con overlay

---

### Menu & MenuItem

Menú desplegable estilo Material UI con anchorEl.

```tsx
const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

<Button onClick={(e) => setAnchorEl(e.currentTarget)}>
  Opciones
</Button>

<Menu
  anchorEl={anchorEl}
  open={Boolean(anchorEl)}
  onClose={() => setAnchorEl(null)}
  anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
>
  <MenuItem 
    label="Editar" 
    icon={<IconEdit />}
    onClick={() => handleEdit()} 
  />
  <MenuItem 
    label="Eliminar"
    onClick={() => handleDelete()} 
  />
</Menu>
```

**Menu Props:**
- `anchorEl`: HTMLElement | null (requerido)
- `open`: boolean (requerido)
- `onClose`: () => void (requerido)
- `children`: React.ReactNode
- `anchorOrigin`: { vertical, horizontal }
- `transformOrigin`: { vertical, horizontal }

**MenuItem Props:**
- `label`: string (requerido)
- `icon`: React.ReactNode
- `onClick`: () => void

---

### Modal

Modal/Dialog centrado con overlay.

```tsx
const [isOpen, setIsOpen] = useState(false);

<Button label="Abrir Modal" onClick={() => setIsOpen(true)} />

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Título del Modal"
  size="md"
>
  <p>Contenido del modal...</p>
</Modal>

// Modal con footer
<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Confirmar acción"
  footer={<Button label="Confirmar" onClick={handleConfirm} />}
>
  <p>¿Estás seguro?</p>
</Modal>
```

**Props:**
- `isOpen`: boolean (requerido)
- `onClose`: () => void (requerido)
- `title`: string
- `children`: React.ReactNode
- `footer`: React.ReactNode - Contenido del footer
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `closeOnOverlayClick`: boolean - Cerrar al hacer clic en el overlay (default: true)
- `closeOnEsc`: boolean - Cerrar al presionar Escape (default: true)

---

### Navbar

Barra de navegación superior con posición configurable.

```tsx
<Navbar>
  <div className="flex-1">
    <Typography variant="h5">Mi App</Typography>
  </div>
  <Button label="Logout" variant="text" />
</Navbar>

// Navbar fijo con altura personalizada
<Navbar position="fixed" height={80} shadow={false}>
  <Typography variant="h4">Dashboard</Typography>
</Navbar>
```

**Props:**
- `children`: React.ReactNode
- `position`: 'fixed' | 'static' | 'relative' | 'absolute' | 'sticky' (default: 'sticky')
- `shadow`: boolean - Mostrar sombra (default: true)
- `height`: number - Altura en píxeles (default: 64)
- `className`: string - Clases adicionales

---

### Pagination

Paginación con números de página.

```tsx
const [page, setPage] = useState(1);

<Pagination
  page={page}
  totalPages={10}
  onPageChange={setPage}
/>

// Con botones de ir al inicio/final
<Pagination
  page={page}
  totalPages={50}
  onPageChange={setPage}
  showFirstLast
  maxVisible={7}
/>
```

**Props:**
- `page`: number (requerido) - Página actual
- `totalPages`: number (requerido)
- `onPageChange`: (page: number) => void (requerido)
- `showFirstLast`: boolean - Mostrar botones de ir al inicio/final (default: false)
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `maxVisible`: number - Cantidad máxima de páginas visibles (default: 5)

---

### Sidebar

Barra lateral con navegación y soporte para submenús (accordion).

```tsx
const [open, setOpen] = useState(false);

const items = [
  { 
    id: 'home', 
    label: 'Inicio', 
    icon: <IconHome />, 
    path: '/' 
  },
  {
    id: 'users',
    label: 'Usuarios',
    icon: <IconUser />,
    children: [
      { id: 'users-list', label: 'Lista', path: '/usuarios' },
      { id: 'users-add', label: 'Agregar', path: '/usuarios/nuevo' },
    ]
  },
];

<Sidebar
  items={items}
  mode="drawer"
  open={open}
  onOpenChange={setOpen}
  footer={<div>Footer content</div>}
/>
```

**Props:**
- `items`: SidebarItem[] (requerido)
- `mode`: 'fixed' | 'drawer' - Fixed siempre visible, drawer se abre/cierra
- `open`: boolean - Controlado (solo para drawer)
- `onOpenChange`: (open: boolean) => void
- `footer`: React.ReactNode - Contenido opcional en el footer

**SidebarItem:**
```tsx
interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: SidebarItem[]; // Para submenús
}
```

---

### Skeleton

Placeholders animados para carga.

```tsx
<Skeleton variant="text" />
<Skeleton variant="circular" width={40} height={40} />
<Skeleton variant="rectangular" width={200} height={100} />
<Skeleton variant="rounded" width={300} height={60} />

// Sin animación
<Skeleton variant="text" animation="none" />
```

**Props:**
- `variant`: 'text' | 'circular' | 'rectangular' | 'rounded'
- `width`: string | number
- `height`: string | number
- `animation`: 'pulse' | 'wave' | 'none' (default: 'pulse')

---

### Stepper

Componente de pasos (steps) para procesos secuenciales.

```tsx
const [activeStep, setActiveStep] = useState(0);

const steps = [
  { 
    label: 'Paso 1', 
    description: 'Información básica',
    completed: true 
  },
  { 
    label: 'Paso 2', 
    description: 'Detalles',
    icon: <IconEdit /> 
  },
  { 
    label: 'Paso 3', 
    description: 'Confirmación',
    disabled: true 
  },
];

<Stepper 
  steps={steps} 
  activeStep={activeStep}
  onStepClick={(index) => setActiveStep(index)}
/>

// Stepper vertical
<Stepper 
  steps={steps} 
  activeStep={activeStep}
  vertical
/>

// Stepper con labels alternativos (centrados debajo)
<Stepper 
  steps={steps} 
  activeStep={activeStep}
  alternativeLabel
/>
```

**Props:**
- `steps`: Step[] (requerido) - Array de pasos
- `activeStep`: number (requerido) - Índice del paso activo (base 0)
- `alternativeLabel`: boolean - Labels centrados debajo de cada paso
- `vertical`: boolean - Orientación vertical
- `onStepClick`: (stepIndex: number) => void - Callback al hacer clic en un paso
- `size`: 'sm' | 'md' | 'lg' (default: 'md')

**Step:**
```tsx
interface Step {
  label: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  completed?: boolean;
  disabled?: boolean;
}
```

---

### Table

Tabla con ordenamiento, selección y paginación integrada.

```tsx
const data = [
  { id: 1, name: 'Juan', age: 25 },
  { id: 2, name: 'María', age: 30 },
];

const columns = [
  { key: 'id', header: 'ID', sortable: true },
  { key: 'name', header: 'Nombre', sortable: true },
  { key: 'age', header: 'Edad', align: 'center' },
];

<Table
  data={data}
  columns={columns}
  pagination
  pageSize={10}
/>

// Con selección
<Table
  data={data}
  columns={columns}
  selectable
  onSelectRow={(row, selected) => console.log(row, selected)}
/>

// Con render personalizado
const columns = [
  { 
    key: 'status', 
    header: 'Estado',
    render: (value, row) => <Badge variant={value}>{value}</Badge>
  },
];
```

**Props:**
- `data`: any[] (requerido) - Array de datos
- `columns`: Column[] (requerido) - Configuración de columnas (**cada columna DEBE tener `key` y `header`**)
- `emptyMessage`: string - Mensaje cuando no hay datos
- `onRowClick`: (row: T) => void - Callback al hacer clic en una fila
- `stickyHeader`: boolean - Encabezados fijos al hacer scroll
- `onSort`: (columnKey: string, direction: 'asc' | 'desc') => void - Callback de ordenamiento
- `selectable`: boolean - Habilita checkboxes de selección
- `selectedRows`: T[] - Filas seleccionadas (modo controlado)
- `onSelectRow`: (row: T, selected: boolean) => void - Callback de selección
- `pagination`: boolean - Habilita paginación
- `page`: number - Página actual (modo controlado)
- `pageSize`: number - Tamaño de página
- `onPageChange`: (page: number) => void - Callback de cambio de página
- `onPageSizeChange`: (pageSize: number) => void - Callback de cambio de tamaño
- `totalCount`: number - Total de registros (para paginación externa)
- `dense`: boolean - Tabla compacta con menos padding
- `tableHeight`: string | number - Altura de la tabla
- `tableWidth`: string | number - Ancho de la tabla

**Column:**
```tsx
interface Column<T> {
  key: keyof T | string; // REQUERIDO: Clave de la columna
  header: string; // REQUERIDO: Texto del encabezado
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}
```

**IMPORTANTE:** Todas las columnas deben tener obligatoriamente las props `key` y `header`.

---

### TablePagination

Componente de paginación para usar con Table u otras listas.

```tsx
<TablePagination
  page={currentPage}
  pageSize={10}
  totalCount={250}
  onPageChange={(page) => setCurrentPage(page)}
  onPageSizeChange={(size) => setPageSize(size)}
/>

// Sin selector de tamaño de página
<TablePagination
  page={currentPage}
  pageSize={25}
  totalCount={100}
  onPageChange={setCurrentPage}
  showPageSizeSelector={false}
/>
```

**Props:**
- `page`: number (requerido) - Página actual
- `pageSize`: number (requerido) - Tamaño de página
- `totalCount`: number (requerido) - Total de registros
- `onPageChange`: (page: number) => void (requerido) - Callback de cambio de página
- `onPageSizeChange`: (pageSize: number) => void - Callback de cambio de tamaño
- `pageSizeOptions`: number[] - Opciones de tamaño (default: [10, 25, 50, 100])
- `showPageSizeSelector`: boolean - Mostrar selector de tamaño (default: true)
- `showInfo`: boolean - Mostrar información "1-10 de 100" (default: true)

---

### Tabs

Pestañas para alternar entre contenidos con soporte para iconos, badges y orientación vertical.

```tsx
const items = [
  { key: 'tab1', label: 'Tab 1', content: <div>Contenido 1</div> },
  { key: 'tab2', label: 'Tab 2', content: <div>Contenido 2</div>, badge: 5 },
  { key: 'tab3', label: 'Tab 3', content: <div>Contenido 3</div>, disabled: true },
];

// Tabs no controladas
<Tabs items={items} defaultActiveKey="tab1" />

// Tabs controladas
const [activeKey, setActiveKey] = useState('tab1');
<Tabs 
  items={items} 
  activeKey={activeKey} 
  onChange={setActiveKey}
  variant="enclosed"
/>

// Tabs verticales con iconos
<Tabs 
  items={[
    { key: 'home', label: 'Inicio', icon: <IconHome />, content: <HomePage /> },
    { key: 'settings', label: 'Config', icon: <IconSettings />, content: <SettingsPage /> },
  ]}
  vertical
  iconPosition="left"
/>
```

**Props:**
- `items`: TabItem[] (requerido)
- `defaultActiveKey`: string - Key inicial (no controlado)
- `activeKey`: string - Key activo (controlado)
- `onChange`: (key: string) => void - Callback al cambiar tab
- `variant`: 'line' | 'enclosed' (default: 'line')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `fullWidth`: boolean - Tabs ocupan todo el ancho
- `centered`: boolean - Tabs centrados
- `vertical`: boolean - Orientación vertical
- `iconPosition`: 'left' | 'right' | 'top' | 'bottom' (default: 'left')
- `tabsClassName`: string - Clases para la barra de tabs
- `contentClassName`: string - Clases para el contenido

**TabItem:**
```tsx
interface TabItem {
  key: string; // REQUERIDO: Identificador único
  label?: string;
  icon?: React.ReactNode;
  content: React.ReactNode; // REQUERIDO: Contenido del tab
  disabled?: boolean;
  badge?: string | number; // Badge opcional
}
```

---

### Tile

Componente para mostrar tarjetas compactas con icono/imagen, título y descripción.

```tsx
// Tile básico
<Tile 
  title="Mi Tile" 
  description="Descripción del tile" 
/>

// Tile con emoji/icono de texto
<Tile 
  icon="🚀" 
  title="Nuevo Proyecto" 
  description="Inicia un nuevo proyecto desde cero" 
/>

// Tile con imagen
<Tile 
  src="/images/feature.png" 
  title="Característica" 
  description="Una característica increíble del producto" 
/>

// Grid de Tiles
<div className="grid grid-cols-3 gap-4">
  <Tile icon="📊" title="Reportes" description="Ver todos los reportes" />
  <Tile icon="⚙️" title="Configuración" description="Ajustar preferencias" />
  <Tile icon="👥" title="Usuarios" description="Gestionar usuarios" />
</div>
```

**Props:**
- `title`: string (requerido) - Título del tile
- `description`: string (requerido) - Descripción del tile
- `icon`: string - Emoji o texto para mostrar como ícono
- `src`: string - URL de imagen (alternativa a icon)
- `className`: string - Clases adicionales

---

### Toast

Sistema de notificaciones toast con provider y hook.

```tsx
// 1. Envolver la app con ToastProvider
import { ToastProvider } from '~/ui/components';

function App() {
  return (
    <ToastProvider position="bottom-right">
      <YourApp />
    </ToastProvider>
  );
}

// 2. Usar el hook en cualquier componente
import { useToast } from '~/ui/components';
import { Button } from '~/ui/components';

function MyComponent() {
  const { addToast } = useToast();

  const handleSuccess = () => {
    addToast('¡Operación exitosa!', 'success');
  };

  const handleError = () => {
    addToast('Algo salió mal', 'error', 3000); // 3 segundos
  };

  return (
    <>
      <Button onClick={handleSuccess}>Mostrar éxito</Button>
      <Button onClick={handleError}>Mostrar error</Button>
    </>
  );
}
```

**ToastProvider Props:**
- `children`: React.ReactNode (requerido)
- `position`: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'left-center' | 'center' | 'right-center' (default: 'bottom-right')

**useToast Hook:**
Retorna un objeto con:
- `addToast: (message: string, type: 'success' | 'error' | 'warning' | 'info', duration?: number) => void`
- `removeToast: (id: string) => void`
- `toasts: Toast[]`

**Toast:**
```tsx
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number; // en milisegundos (default: 5000, 0 = no auto-cerrar)
}
```

---

### Typography

Componente de tipografía con variantes predefinidas.

```tsx
<Typography variant="h1">Título Principal</Typography>
<Typography variant="h2">Subtítulo</Typography>
<Typography variant="paragraph">Texto normal</Typography>
<Typography variant="paragraph-lg">Texto grande</Typography>
<Typography variant="paragraph-sm">Texto pequeño</Typography>
<Typography variant="caption">Texto secundario</Typography>
<Typography variant="micro">Texto muy pequeño</Typography>

// Cambiar el elemento HTML
<Typography variant="h2" as="h1">Se ve como h2 pero es h1</Typography>

// Con alineación
<Typography variant="paragraph" align="center">Texto centrado</Typography>
<Typography variant="paragraph" align="right">Texto a la derecha</Typography>
```

**Props:**
- `variant`: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'h7' | 'label' | 'paragraph' | 'paragraph-lg' | 'paragraph-sm' | 'caption' | 'micro'
- `as`: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label' - Elemento HTML a renderizar
- `color`: 'primary' | 'secondary' | 'accent' | 'white' | 'error' | 'success' | 'warning' | 'info' | 'gray' | 'helper' - Color del texto
- `align`: 'left' | 'right' | 'center' - Alineación del texto
- `className`: string - Clases adicionales de Tailwind

---

## 📝 Componentes de Formulario

### Input

Input de texto con label, iconos y estados de error.

```tsx
<Input
  label="Nombre"
  placeholder="Ingrese su nombre"
  value={name}
  onChange={(e) => setName(e.target.value)}
  icon={<IconUser />}
  iconPosition="left"
  required
/>

<Input
  label="Email"
  type="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error="Email inválido"
  touched={true}
/>
```

**Props:**
- `label`: string
- `labelPosition`: 'top' | 'left' (default: 'top')
- `type`: string
- `id`: string - Usado también como name
- `placeholder`: string
- `icon`: React.ReactNode
- `iconPosition`: 'left' | 'right' (default: 'left')
- `error`: string
- `helperText`: string
- `required`: boolean
- `disabled`: boolean
- `fullWidth`: boolean
- `touched`: boolean - Indica si el campo fue tocado (para mostrar errores)
- Extiende `React.InputHTMLAttributes<HTMLInputElement>`

---

### InputNumber

Input especializado para números con formato de miles y decimales.

```tsx
<InputNumber
  label="Precio"
  decimals={2}
  placeholder="0,00"
/>

<InputNumber
  label="Cantidad"
  decimals={0}
  helperText="Solo números enteros"
/>
```

**Props:**
- Todas las props de `Input` excepto `type`, `value` y `onChange`
- `decimals`: number - Cantidad de decimales permitidos (default: 2)

**Formato:**
- Usa punto (.) para separar miles: 1.000
- Usa coma (,) para decimales: 1.234,56
- Maneja el estado internamente y formatea automáticamente

---

### Select

Select con búsqueda y soporte para selección múltiple.

```tsx
// Select simple
<Select
  label="País"
  options={[
    { label: 'Argentina', value: 'ar' },
    { label: 'Brasil', value: 'br' },
  ]}
  value={country}
  onChange={setCountry}
  placeholder="Seleccione..."
/>

// Select múltiple
<Select
  label="Habilidades"
  options={skills}
  value={selectedSkills}
  onChange={setSelectedSkills}
  multiple
/>

// Con error
<Select
  label="Categoría"
  options={categories}
  value={category}
  onChange={setCategory}
  error="Debe seleccionar una categoría"
  helperText="Texto de ayuda"
/>
```

**Props:**
- `id`: string
- `label`: string
- `labelPosition`: 'top' | 'left' (default: 'top')
- `options`: SelectOption[] (requerido)
- `value`: string | string[]
- `onChange`: (value: string | string[]) => void
- `placeholder`: string (default: 'Seleccionar...')
- `multiple`: boolean
- `disabled`: boolean
- `required`: boolean
- `className`: string
- `helperText`: string
- `error`: string

**SelectOption:**
```tsx
interface SelectOption {
  label: string;
  value: string;
}
```

---

### Checkbox

Checkbox con label y descripción opcional.

```tsx
<Checkbox
  id="terms"
  label="Acepto términos y condiciones"
  checked={accepted}
  onChange={(e) => setAccepted(e.target.checked)}
/>

// Con descripción
<Checkbox
  id="notifications"
  label="Recibir notificaciones"
  description="Te enviaremos emails con las novedades"
  checked={notifications}
  onChange={(e) => setNotifications(e.target.checked)}
/>

// Variante boxed (con fondo)
<Checkbox
  id="agree"
  label="Estoy de acuerdo"
  description="He leído y acepto las condiciones"
  variant="boxed"
  checked={agree}
  onChange={(e) => setAgree(e.target.checked)}
/>

// Con error
<Checkbox
  id="terms"
  label="Acepto términos"
  checked={false}
  onChange={handleChange}
  error="Debe aceptar los términos"
  touched={true}
/>
```

**Props:**
- `id`: string
- `label`: string
- `description`: string - Texto descriptivo debajo del label
- `checked`: boolean (requerido)
- `onChange`: (e) => void (requerido)
- `disabled`: boolean
- `required`: boolean
- `variant`: 'plain' | 'boxed' - Plain es simple, boxed tiene fondo y borde
- `error`: string
- `touched`: boolean - Indica si el campo fue tocado (para mostrar errores)

---

### Switch

Switch/Toggle para valores booleanos.

```tsx
<Switch
  checked={notifications}
  onChange={setNotifications}
  label="Recibir notificaciones"
/>

// Diferentes tamaños
<Switch checked={value} onChange={setValue} size="sm" />
<Switch checked={value} onChange={setValue} size="md" />
<Switch checked={value} onChange={setValue} size="lg" />
<Switch checked={value} onChange={setValue} size="xl" />
```

**Props:**
- `checked`: boolean (default: false)
- `onChange`: (checked: boolean) => void
- `label`: string
- `labelPosition`: 'left' | 'right' (default: 'right')
- `required`: boolean
- `disabled`: boolean
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `error`: string
- `helperText`: string

---

### RadioGroup

Grupo de radio buttons.

```tsx
<RadioGroup
  label="Género"
  options={[
    { label: 'Masculino', value: 'male' },
    { label: 'Femenino', value: 'female' },
    { label: 'Otro', value: 'other' },
  ]}
  value={gender}
  onChange={setGender}
  direction="horizontal"
/>

// Con descripciones
<RadioGroup
  label="Plan"
  options={[
    { 
      label: 'Básico', 
      value: 'basic',
      description: 'Incluye funciones básicas' 
    },
    { 
      label: 'Premium', 
      value: 'premium',
      description: 'Todas las funciones' 
    },
  ]}
  value={plan}
  onChange={setPlan}
  variant="boxed"
/>

// Con error
<RadioGroup
  label="Seleccione una opción"
  options={options}
  value={value}
  onChange={setValue}
  error="Debe seleccionar una opción"
  touched={true}
/>
```

**Props:**
- `label`: string
- `labelPosition`: 'top' | 'left' (default: 'top')
- `options`: RadioOption[] (requerido)
- `value`: string
- `onChange`: (value: string) => void (requerido)
- `direction`: 'horizontal' | 'vertical' (default: 'horizontal')
- `disabled`: boolean
- `required`: boolean
- `variant`: 'plain' | 'boxed' - Plain es simple, boxed tiene fondo y borde
- `error`: string
- `touched`: boolean - Indica si el campo fue tocado (para mostrar errores)

**RadioOption:**
```tsx
interface RadioOption {
  value: string;
  label: string;
  description?: string; // Texto descriptivo debajo del label
}
```

---

### TextArea

Área de texto multilinea.

```tsx
<TextArea
  label="Comentarios"
  value={comments}
  onChange={(e) => setComments(e.target.value)}
  rows={4}
  placeholder="Escribe tus comentarios..."
/>

// Con error
<TextArea
  label="Descripción"
  value={description}
  onChange={handleChange}
  error="La descripción es requerida"
  touched={true}
  required
/>
```

**Props:**
- `label`: string
- `labelPosition`: 'top' | 'left' (default: 'top')
- `id`: string - Usado también como name
- `placeholder`: string
- `rows`: number
- `error`: string
- `helperText`: string
- `required`: boolean
- `disabled`: boolean
- `fullWidth`: boolean
- `touched`: boolean - Indica si el campo fue tocado (para mostrar errores)
- Extiende `React.TextareaHTMLAttributes<HTMLTextAreaElement>`

---

### FileDropzone

Zona de carga de archivos (drag & drop o selección).

```tsx
// Archivo único
const [file, setFile] = useState<File[]>([]);

<FileDropzone
  accept=".pdf,.doc"
  value={file}
  onChange={setFile}
/>

// Múltiples archivos
const [files, setFiles] = useState<File[]>([]);

<FileDropzone
  multiple
  accept=".jpg,.png"
  value={files}
  onChange={setFiles}
  error="Archivo muy grande"
/>
```

**Props:**
- `accept`: string (requerido) - Extensiones permitidas
- `value`: File[] (requerido) - Siempre un array, en modo simple solo usa el primero
- `onChange`: (files: File[]) => void (requerido)
- `multiple`: boolean - Si es false, solo permite un archivo (value[0])
- `error`: string
- `onClear`: (index?: number) => void

---

## 🎨 Sistema de Colores

### Paleta Principal
- **Primary**: Verde institucional (#006149)
- **Secondary**: Beige institucional (#d5c9b6)
- **Accent**: Gris para textos (#595857)
- **Gray**: Variantes de gris para fondos y bordes

### Colores de Estado
- **Success**: Verde (#31C950)
- **Warning**: Amarillo (#F0B13B)
- **Error**: Rojo (#FB2C36)
- **Info**: Azul (#2B7FFF)

### Fuentes
- **Aller**: Fuente principal
- **Aller Bold**: Títulos y textos destacados
- **Aller Light**: Textos secundarios

---

## ✅ Checklist para Modelos de IA

Antes de crear cualquier componente, verificar:

1. ✅ ¿El componente ya existe en este documento?
2. ✅ ¿Puedo usar un componente existente modificando props?
3. ✅ ¿Puedo combinar componentes existentes?
4. ✅ ¿He revisado las variantes y opciones disponibles?

**Solo crear un nuevo componente si:**
- No existe absolutamente nada similar
- La funcionalidad es completamente nueva
- No se puede lograr combinando componentes existentes

---

## 📖 Ejemplos de Uso Común

### Formulario Completo

```tsx
import { Button, Card, Typography } from '~/ui/components';
import { Input, Select, Switch } from '~/ui/components/forms';

export function UserForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [country, setCountry] = useState('');
  const [newsletter, setNewsletter] = useState(false);

  return (
    <Card>
      <Typography variant="h3">Formulario de Usuario</Typography>
      
      <div className="space-y-4">
        <Input
          label="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        
        <Select
          label="País"
          options={[
            { label: 'Argentina', value: 'ar' },
            { label: 'Brasil', value: 'br' },
          ]}
          value={country}
          onChange={setCountry}
        />
        
        <Switch
          label="Suscribirse al newsletter"
          checked={newsletter}
          onChange={setNewsletter}
        />
        
        <Button 
          label="Guardar" 
          variant="contained" 
          color="primary"
          onClick={handleSubmit}
        />
      </div>
    </Card>
  );
}
```

### Layout con Sidebar y Navbar

```tsx
import { Button, Navbar, Sidebar, Typography } from '~/ui/components';
import { useState } from 'react';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const sidebarItems = [
    { 
      id: 'home', 
      label: 'Inicio', 
      path: '/' 
    },
    {
      id: 'users',
      label: 'Usuarios',
      path: '/usuarios'
    },
  ];

  return (
    <div className="flex h-screen">
      <Navbar>
        <Button 
          label="Menu"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        />
        <Typography variant="h5">Mi Aplicación</Typography>
      </Navbar>
      
      <Sidebar
        items={sidebarItems}
        mode="drawer"
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
      />
      
      <div className="flex-1 p-8">
        {children}
      </div>
    </div>
  );
}
```

---

**RECORDATORIO FINAL:** Todos estos componentes están implementados y funcionando. **USARLOS SIEMPRE** en lugar de crear nuevos.
