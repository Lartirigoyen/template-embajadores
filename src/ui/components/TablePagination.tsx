'use client';

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

export interface TablePaginationProps {
  page: number;
  pageSize: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
  showInfo?: boolean;
}

export const TablePagination = ({
  page,
  pageSize,
  totalCount,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
  showPageSizeSelector = true,
  showInfo = true,
}: TablePaginationProps) => {
  const totalPages = Math.ceil(totalCount / pageSize);
  const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);

  if (totalCount === 0) return null;

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

  // Generate page numbers with ellipsis
  const getPages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (page <= 4) {
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (page >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
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

  return (
    <div className="flex items-center justify-between gap-4 py-3 px-4 border-t border-gray-200">
      {/* Info section */}
      {showInfo && (
        <div className="text-sm text-gray-700 font-aller">
          Mostrando <span className="font-aller-bold">{startItem}</span> a{' '}
          <span className="font-aller-bold">{endItem}</span> de{' '}
          <span className="font-aller-bold">{totalCount}</span> resultados
        </div>
      )}

      {/* Center navigation */}
      <nav className="flex items-center gap-1">
        <button
          onClick={handleFirst}
          disabled={page === 1}
          className="px-2 py-1 text-sm font-aller border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Primera página"
        >
          ««
        </button>
        <button
          onClick={handlePrev}
          disabled={page === 1}
          className="px-3 py-1 text-sm font-aller border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          title="Página anterior"
        >
          <IconChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        {getPages().map((p, index) =>
          typeof p === 'number' ? (
            <button
              key={index}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1 text-sm font-aller border rounded transition-colors ${
                p === page
                  ? 'bg-primary-800 text-white border-primary-800'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {p}
            </button>
          ) : (
            <span key={index} className="px-2 py-1 text-gray-500">
              {p}
            </span>
          )
        )}

        <button
          onClick={handleNext}
          disabled={page === totalPages}
          className="px-3 py-1 text-sm font-aller border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-1"
          title="Página siguiente"
        >
          Siguiente
          <IconChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={handleLast}
          disabled={page === totalPages}
          className="px-2 py-1 text-sm font-aller border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Última página"
        >
          »»
        </button>
      </nav>

      {/* Page size selector */}
      {showPageSizeSelector && onPageSizeChange && (
        <div className="flex items-center gap-2">
          <label htmlFor="pageSize" className="text-sm text-gray-700 font-aller">
            Filas por página:
          </label>
          <select
            id="pageSize"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="px-2 py-1 text-sm font-aller border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default TablePagination;
