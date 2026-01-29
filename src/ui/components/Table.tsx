'use client';

import { IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import TablePagination from './TablePagination';
import { useState, useMemo } from 'react';
import Checkbox from './forms/Checkbox';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
}

export interface TableProps<T> {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
  stickyHeader?: boolean;
  onSort?: (columnKey: string, direction: 'asc' | 'desc') => void;
  selectable?: boolean;
  selectedRows?: T[];
  onSelectRow?: (row: T, selected: boolean) => void;
  pagination?: boolean;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  totalCount?: number;
  dense?: boolean; // Si la tabla es compacta o no
  tableHeight?: string | number;
  tableWidth?: string | number;
}

export function Table<T>({
  data,
  columns,
  emptyMessage = 'No hay datos disponibles',
  onRowClick,
  stickyHeader = false,
  onSort,
  selectable = false,
  selectedRows = [],
  onSelectRow,
  pagination = false,
  page = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  totalCount,
  dense = false,
  tableHeight,
  tableWidth,
}: TableProps<T>) {
  // Sorting state
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  // Selection state (if not controlled)
  const [internalSelected, setInternalSelected] = useState<T[]>([]);

  // Pagination state (if not controlled)
  const [internalPage, setInternalPage] = useState(1);

  // Handle sort
  const handleSort = (col: Column<T>) => {
    if (!col.sortable) return;
    let direction: 'asc' | 'desc' = 'asc';
    if (sortKey === col.key) {
      direction = sortDir === 'asc' ? 'desc' : 'asc';
    }
    setSortKey(col.key as string);
    setSortDir(direction);
    onSort?.(col.key as string, direction);
  };

  // Handle select row
  const handleSelectRow = (row: any, next: boolean) => {
    if (onSelectRow) return onSelectRow(row, next);

    setInternalSelected(prev =>
      next ? [...prev, row] : prev.filter((r: any) => r.id !== row.id)
    );
  };

  // Sorting logic
  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find(c => c.key === sortKey);
    if (!col) return data;
    return [...data].sort((a, b) => {
      const aValue = (a as any)[sortKey];
      const bValue = (b as any)[sortKey];
      if (aValue === bValue) return 0;
      if (sortDir === 'asc') return aValue > bValue ? 1 : -1;
      return aValue < bValue ? 1 : -1;
    });
  }, [data, sortKey, sortDir, columns]);

  // Pagination logic
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    const p = onPageChange ? page : internalPage;
    const start = (p - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, pagination, page, pageSize, internalPage, onPageChange]);

  if (data.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-accent font-aller">{emptyMessage}</p>
      </div>
    );
  }
  
  const cellClass = dense
    ? 'px-2 py-1 text-xs'
    : 'px-4 py-2 text-sm';
  const headerClass = dense
    ? 'px-2 py-1 text-xs'
    : 'px-4 py-2 text-base';

  const isSelected = (r: any) => (onSelectRow ? selectedRows : internalSelected).some((x: any) => x.id === r.id);
  
  return (
    <div
      className="overflow-auto"
      style={{
        height: tableHeight,
        width: tableWidth,
        maxWidth: '100%',
      }}
    >
      <table className="min-w-full divide-y divide-gray-dark">
        <thead className={`bg-primary-800 ${stickyHeader ? ' sticky top-0 z-10' : ''}`}>
          <tr>
            {selectable && <th className={headerClass}></th>}
            {columns.map((column, index) => (
              <th
                key={index}
                className={`${headerClass} font-aller-bold uppercase text-white select-none cursor-pointer`}
                style={{ width: column.width, textAlign: column.align }}
                onClick={() => column.sortable && handleSort(column)}
              >
                <div className='flex items-center gap-2'>
                  <span>{column.header}</span>
                  {column.sortable && sortKey === column.key && (
                    <>{sortDir === 'asc' ? <IconSortAscending /> : <IconSortDescending />}</>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {paginatedData.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick?.(row)}
              className={`font-aller hover:bg-gray-50 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
            >
              {selectable && (
                <td className={cellClass}>
                  <Checkbox 
                    id={`select-row-${rowIndex}`}
                    checked={isSelected(row)}
                    onChange={(e) => {
                      e.stopPropagation();
                      handleSelectRow(row, e.target.checked);
                    }}
                  />
                </td>
              )}
              {columns.map((column, colIndex) => {
                const value = (row as any)[column.key];
                return (
                  <td key={colIndex} className={`${cellClass} whitespace-nowrap text-gray-900`}>
                    {column.render ? column.render(value, row) : value}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      {pagination && (
        <TablePagination
          page={onPageChange ? page : internalPage}
          pageSize={pageSize}
          totalCount={totalCount ?? data.length}
          onPageChange={onPageChange ?? setInternalPage}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}