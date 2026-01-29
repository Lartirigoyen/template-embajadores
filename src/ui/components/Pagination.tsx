'use client';

import { IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight } from '@tabler/icons-react';
import Typography from './Typography';

export interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showFirstLast?: boolean;
  size?: 'sm' | 'md' | 'lg';
  maxVisible?: number;
}

export const Pagination = ({
  page,
  totalPages,
  onPageChange,
  showFirstLast = false,
  size = 'md',
  maxVisible = 5
}: PaginationProps) => {
  if (totalPages <= 1) return null;

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  const handleFirst = () => {
    onPageChange(1);
  };

  const handleLast = () => {
    onPageChange(totalPages);
  };

  // Generate page numbers
  const getPages = () => {
    const pages: (number | string)[] = [];

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const halfVisible = Math.floor(maxVisible / 2);
      
      if (page <= halfVisible + 1) {
        for (let i = 1; i <= maxVisible - 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - halfVisible) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - maxVisible + 2; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = page - 1; i <= page + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const boxSize = {
    sm: 'px-2 py-1',
    md: 'px-3 py-1.5',
    lg: 'px-4 py-2',
  };

  return (
    <nav className="flex items-center justify-center gap-2">
      {showFirstLast && (
        <div 
          className={`border border-gray-medium rounded-lycsa ${boxSize[size]} ${page === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100'} transition-colors duration-200`}
          onClick={handleFirst}
        >
          <IconChevronsLeft className={`text-accent`} />
        </div>
      )}

      <div 
        className={`border border-gray-medium rounded-lycsa ${boxSize[size]} ${page === 1 ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100'} transition-colors duration-200`}
        onClick={handlePrev}
      >
        <IconChevronLeft className={`text-accent`} />
      </div>

      {getPages().map((p, index) =>
        typeof p === 'number' ? (
          <div 
            className={`rounded-lycsa ${boxSize[size]} ${p === page ? 'bg-primary-800 border border-primary-800' : 'bg-white hover:bg-gray-light border border-gray-medium'} cursor-pointer transition-colors duration-200`}
            key={index}
            onClick={() => onPageChange(p)}
          >
            {p === page ? (
              <Typography variant="h6" as="span" color='white'>{p}</Typography>
            ) : (
              <Typography variant="paragraph" as="span">{p}</Typography>
            )}
          </div>
        ) : (
          <Typography key={index} variant="paragraph" as="span" className="px-2">{p}</Typography>
        )
      )}

      <div 
        className={`border border-gray-medium rounded-lycsa ${boxSize[size]} ${page === totalPages ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100'} transition-colors duration-200`}
        onClick={handleNext}
      >
        <IconChevronRight className={`text-accent`} />
      </div>

      {showFirstLast && (
        <div 
          className={`border border-gray-medium rounded-lycsa ${boxSize[size]} ${page === totalPages ? 'cursor-not-allowed opacity-50' : 'cursor-pointer opacity-100'} transition-colors duration-200`}
          onClick={handleLast}
        >
          <IconChevronsRight className={`text-accent`} />
        </div>
      )}
    </nav>
  );
};

export default Pagination;