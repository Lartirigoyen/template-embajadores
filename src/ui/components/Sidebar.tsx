'use client';

import { useEffect, useState } from "react";
import SidebarItem, { SidebarNode } from "./SidebarNode";

export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: SidebarItem[];
}

interface SidebarProps {
  items: SidebarItem[];
  mode?: "fixed" | "drawer";     // "fixed" (siempre) | "drawer" (abre/cierra)
  defaultOpen?: boolean;         // para drawer
  open?: boolean;                // controlado (opcional)
  onOpenChange?: (open: boolean) => void;
  navbarHeight?: number;        // altura del navbar para calcular la altura del sidebar en modo drawer
  footer?: React.ReactNode;      // contenido opcional del footer
}

export const Sidebar = ({
  items,
  mode = "fixed",
  defaultOpen = false,
  open: openControlled,
  navbarHeight,
  onOpenChange,
  footer
}: SidebarProps) => {
  //const { pathname } = useLocation();
  const pathname = window.location.pathname;
  //const navigate = useNavigate();
  const isDrawer = mode === "drawer";

  const [openUncontrolled, setOpenUncontrolled] = useState(defaultOpen);
  const open = openControlled ?? openUncontrolled;

  const setOpen = (v: boolean) => {
    if (openControlled === undefined) setOpenUncontrolled(v);
    onOpenChange?.(v);
  };

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      const hasActiveChild = (node: SidebarItem): boolean => {
        if (node.path && node.path === pathname) return true;
        return (node.children ?? []).some(hasActiveChild);
      };
      items.forEach((it) => {
        if (it.children?.length && hasActiveChild(it)) initial[it.id] = true;
      });
      return initial;
    }
  );

  // Cerrar con ESC (solo drawer)
  useEffect(() => {
    if (!isDrawer || !open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawer, open]);

  const toggleGroup = (id: string) =>
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));

  const navigateTo = (path: string) => {
    console.log("Navegar a:", path);
    // navigate(path);
    // Cerrar al navegar
    if (isDrawer) setOpen(false);
  };

  const content = (
    <aside
      className={`h-full flex flex-col border-r border-gray-medium bg-white transition-[width] duration-200 ${
        isDrawer ? 'w-full md:w-72' : 'w-72'
      }`}
      aria-label="Sidebar"
    >
      <nav className={`flex-1 p-4 flex flex-col gap-4 overflow-y-auto`} role="navigation">
        {items.map((item) => (
          <SidebarNode
            key={item.id}
            item={item}
            pathname={pathname}
            isOpen={!!openGroups[item.id]}
            onToggle={() => toggleGroup(item.id)}
            onNavigate={navigateTo}
          />
        ))}
      </nav>

      {footer && (
        <div className="border-t border-primary-800 pt-4">
          {footer}
        </div>
      )}
    </aside>
  );

  if (!isDrawer) {
    return (
      <div className="h-screen sticky top-0 shrink-0">
        {content}
      </div>
    );
  }

  return (
    <div
      className={`fixed left-0 z-40 transition-transform duration-300 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{ 
        top: `${navbarHeight ?? 0}px`, // altura del navbar
        height: `calc(100vh - ${navbarHeight ?? 0}px)`
      }}
    >
      {content}
    </div>
  );
};

export default Sidebar;