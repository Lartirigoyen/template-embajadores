'use client'

import Typography from "./Typography";

interface TileProps {
  icon?: string;
  src?: string;
  title: string;
  description: string;
  className?: string;
}

export const Tile = ({ icon, src, title, description, className = '' }: TileProps) => {
  return (
    <div className={`flex flex-col gap-2 p-4 bg-white rounded-lycsa border-2 border-gray-light hover:shadow-lycsa-md transition-shadow ${className}`}>
      <div className="flex items-center gap-2">
        {icon ? (
          <div className="flex items-center justify-center size-6 rounded-full">
            {icon}
          </div>
        ) : src && (
          <div className="flex items-center justify-center size-6 rounded-full">
            <img src={src} alt={title} className="w-full h-full object-cover" />
          </div>
        )}
        <Typography variant="h6" as="h6">{title}</Typography>
      </div>
      <Typography variant="caption" as="p">{description}</Typography>
    </div>
  )
}

export default Tile;