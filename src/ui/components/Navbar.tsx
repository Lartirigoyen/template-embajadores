'use client';

interface NavbarProps {
  position?: 'fixed' | 'static' | 'relative' | 'absolute' | 'sticky';
  shadow?: boolean;
  children?: React.ReactNode;
  className?: string;
  height?: number;
}

export const Navbar = ({
  position = 'sticky',
  shadow = true,
  children,
  className = '',
  height = 64,
}: NavbarProps) => {
  return (
    <nav
      className={`w-full flex items-center px-4 py-2 bg-white ${shadow ? 'shadow-lycsa-md' : ''} z-50 ${className}`}
      style={{
        position,
        top: position === 'sticky' || position === 'fixed' ? 0 : undefined,
        height,
      }}
    >
      <div className="w-full flex items-center justify-between gap-4">
        {children}
      </div>
    </nav>
  );
};

export default Navbar;