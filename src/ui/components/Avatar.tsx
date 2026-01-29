'use client';

import Typography from "./Typography";

interface AvatarProps {
  src?: string;
  name?: string;
  positionName?: 'left' | 'right';
  description?: string;
  onlyInitials?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'primary' | 'secondary' | 'gray' | 'accent';
  className?: string;
}

export const Avatar = ({ 
  src, 
  name, 
  positionName = 'right',
  description,
  onlyInitials = false, 
  size = 'md', 
  color = 'primary', 
  className 
}: AvatarProps) => {
  function getInitials(name?: string) {
    if (!name) return '';
    const words = name.split(' ');
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }

  const initials = getInitials(name);

  const fontSize: {[key: string]: 'h2' | 'h4' | 'h6' | 'h7'} = {
    sm: 'h7',
    md: 'h6',
    lg: 'h4',
    xl: 'h2',
  };

  const sizeValues = {
    sm: 'size-8',
    md: 'size-10',
    lg: 'size-12',
    xl: 'size-14',
  };

  const colorBackground = {
    primary: 'bg-primary-100',
    secondary: 'bg-secondary-100',
    gray: 'bg-gray-light',
    accent: 'bg-gray-light',
  }

  return (
    <div className={`flex items-center gap-2 ${positionName === 'left' ? 'flex-row-reverse' : ''}`}>
      <div
        className={`flex justify-center items-center rounded-full overflow-hidden
          ${src ? 'background-transparent' : colorBackground[color]} ${sizeValues[size]} ${className}`}
      >
        {src ? (
          <img
            src={src}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Typography variant={`${fontSize[size]}`} as="span" color={color}>{initials}</Typography>
        )}
      </div>
      {!onlyInitials && (
        <div className="flex flex-col gap-1">
          <Typography variant="h7" as="span" align={`${positionName === 'left' ? 'left' : 'right'}`}>{name}</Typography>
          {description && (
            <Typography variant="micro" as="span" align={`${positionName === 'left' ? 'right' : 'left'}`}>{description}</Typography>
          )}
        </div>
      )}
    </div>
  );
};

export default Avatar;