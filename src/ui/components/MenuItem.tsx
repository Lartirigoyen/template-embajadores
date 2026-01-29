'use client';

import Typography from "./Typography";

interface MenuItemProps {
  label: string;
  value?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export const MenuItem = ({ label, icon, onClick }: MenuItemProps) => {
  return (
    <div
      className="flex items-center gap-2 px-4 py-2 cursor-pointer rounded-lycsa hover:bg-gray-light transition-colors"
      onClick={onClick}
    >
      {icon && (
        <div className="w-5 h-5 flex items-center justify-center text-accent">
          {icon}
        </div>
      )}
      <Typography variant="paragraph" as="span">{label}</Typography>
    </div>
  );
};

export default MenuItem;