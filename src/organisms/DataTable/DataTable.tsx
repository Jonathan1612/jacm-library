import React, { forwardRef, useState, useMemo } from 'react';
import { BaseComponentProps } from '../../types/common';
import { Button } from '../../atoms/Button/Button';
import { Checkbox } from '../../atoms/Checkbox/Checkbox';
import { TextField } from '../../atoms/TextField/TextField';
import { cn } from '../../utils/classNames';
import styles from './DataTable.module.css';

export interface DataTableColumn<T = any> {
  /** ID único de la columna */
  id: string;
  /** Texto del encabezado */
  header: string;
  /** Clave del campo en los datos */
  accessor?: keyof T;
  /** Función personalizada para renderizar la celda */
  cell?: (value: any, row: T, index: number) => React.ReactNode;
  /** Si la columna es sorteable */
  sortable?: boolean;
  /** Ancho de la columna */
  width?: string | number;
  /** Ancho mínimo */
  minWidth?: string | number;
  /** Si la columna está oculta */
  hidden?: boolean;
  /** Alineación del contenido */
  align?: 'left' | 'center' | 'right';
  /** Si es una columna fija */
  sticky?: 'left' | 'right';
}

export interface DataTableSort {
  /** ID de la columna */
  columnId: string;
  /** Dirección del ordenamiento */
  direction: 'asc' | 'desc';
}

export interface DataTableProps<T = any> extends BaseComponentProps {
  /** Datos de la tabla */
  data: T[];
  /** Definición de columnas */
  columns: DataTableColumn<T>[];
  /** Si se pueden seleccionar filas */
  selectable?: boolean;
  /** Filas seleccionadas */
  selectedRows?: T[];
  /** Callback al cambiar selección */
  onSelectionChange?: (selectedRows: T[]) => void;
  /** Si tiene paginación */
  pagination?: boolean;
  /** Número de elementos por página */
  pageSize?: number;
  /** Página actual */
  currentPage?: number;
  /** Callback al cambiar página */
  onPageChange?: (page: number) => void;
  /** Total de elementos (para paginación externa) */
  totalItems?: number;
  /** Si tiene búsqueda */
  searchable?: boolean;
  /** Valor de búsqueda */
  searchValue?: string;
  /** Callback al cambiar búsqueda */
  onSearchChange?: (value: string) => void;
  /** Placeholder del buscador */
  searchPlaceholder?: string;
  /** Ordenamiento actual */
  sort?: DataTableSort;
  /** Callback al cambiar ordenamiento */
  onSortChange?: (sort: DataTableSort | null) => void;
  /** Si está cargando */
  loading?: boolean;
  /** Mensaje cuando no hay datos */
  emptyMessage?: string;
  /** Variante de estilo */
  variant?: 'default' | 'striped' | 'bordered';
  /** Tamaño de la tabla */
  size?: 'small' | 'medium' | 'large';
  /** Si es responsiva */
  responsive?: boolean;
  /** Altura fija */
  height?: string | number;
  /** Acciones de fila */
  rowActions?: (row: T, index: number) => React.ReactNode;
  /** Callback al hacer clic en una fila */
  onRowClick?: (row: T, index: number) => void;
}

export const DataTable = forwardRef<HTMLDivElement, DataTableProps>(({
  data = [],
  columns = [],
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  pagination = false,
  pageSize = 10,
  currentPage = 1,
  onPageChange,
  totalItems,
  searchable = false,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  sort,
  onSortChange,
  loading = false,
  emptyMessage = 'No hay datos disponibles',
  variant = 'default',
  size = 'medium',
  responsive = true,
  height,
  rowActions,
  onRowClick,
  className,
  style,
  ...props
}, ref) => {
  const [internalSearchValue, setInternalSearchValue] = useState('');
  const [internalSort, setInternalSort] = useState<DataTableSort | null>(null);
  const [internalPage, setInternalPage] = useState(1);

  const searchVal = searchValue || internalSearchValue;
  const currentSort = sort || internalSort;
  const page = currentPage || internalPage;

  // Filtrar datos por búsqueda
  const filteredData = useMemo(() => {
    if (!searchVal) return data;
    
    return data.filter((row) =>
      columns.some((column) => {
        if (column.accessor) {
          const value = row[column.accessor];
          return String(value).toLowerCase().includes(searchVal.toLowerCase());
        }
        return false;
      })
    );
  }, [data, searchVal, columns]);

  // Ordenar datos
  const sortedData = useMemo(() => {
    if (!currentSort) return filteredData;

    const column = columns.find(col => col.id === currentSort.columnId);
    if (!column || !column.accessor) return filteredData;

    return [...filteredData].sort((a, b) => {
      const aValue = a[column.accessor!];
      const bValue = b[column.accessor!];
      
      if (aValue < bValue) return currentSort.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return currentSort.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, currentSort, columns]);

  // Paginar datos
  const paginatedData = useMemo(() => {
    if (!pagination) return sortedData;
    
    const startIndex = (page - 1) * pageSize;
    return sortedData.slice(startIndex, startIndex + pageSize);
  }, [sortedData, pagination, page, pageSize]);

  const totalPages = Math.ceil((totalItems || sortedData.length) / pageSize);
  const displayData = paginatedData;

  const handleSearch = (value: string) => {
    if (onSearchChange) {
      onSearchChange(value);
    } else {
      setInternalSearchValue(value);
    }
    // Reset page when searching
    if (onPageChange) {
      onPageChange(1);
    } else {
      setInternalPage(1);
    }
  };

  const handleSort = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    if (!column?.sortable) return;

    let newSort: DataTableSort | null = null;
    
    if (!currentSort || currentSort.columnId !== columnId) {
      newSort = { columnId, direction: 'asc' };
    } else if (currentSort.direction === 'asc') {
      newSort = { columnId, direction: 'desc' };
    }
    // If direction is 'desc', newSort stays null (removes sort)

    if (onSortChange) {
      onSortChange(newSort);
    } else {
      setInternalSort(newSort);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (onPageChange) {
      onPageChange(newPage);
    } else {
      setInternalPage(newPage);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;
    
    if (checked) {
      const allRows = [...selectedRows];
      displayData.forEach(row => {
        if (!selectedRows.some(selected => selected === row)) {
          allRows.push(row);
        }
      });
      onSelectionChange(allRows);
    } else {
      const newSelection = selectedRows.filter(selected => 
        !displayData.some(row => row === selected)
      );
      onSelectionChange(newSelection);
    }
  };

  const handleRowSelect = (row: any, checked: boolean) => {
    if (!onSelectionChange) return;
    
    if (checked) {
      onSelectionChange([...selectedRows, row]);
    } else {
      onSelectionChange(selectedRows.filter(selected => selected !== row));
    }
  };

  const isAllSelected = displayData.length > 0 && displayData.every(row => 
    selectedRows.some(selected => selected === row)
  );

  const tableClasses = cn(
    styles.container,
    styles[variant],
    styles[size],
    responsive && styles.responsive,
    className
  );

  return (
    <div ref={ref} className={tableClasses} style={style} {...props}>
      {/* Header con búsqueda */}
      {searchable && (
        <div className={styles.header}>
          <TextField
            value={searchVal}
            onChange={(value) => handleSearch(value)}
            placeholder={searchPlaceholder}
            size={size}
            className={styles.searchInput}
          />
        </div>
      )}

      {/* Tabla */}
      <div 
        className={styles.tableWrapper}
        style={{ height }}
      >
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              {selectable && (
                <th className={styles.th}>
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={selectedRows.length > 0 && !isAllSelected}
                    onChange={(checked) => handleSelectAll(checked)}
                    size={size}
                  />
                </th>
              )}
              {columns.filter(col => !col.hidden).map((column) => (
                <th
                  key={column.id}
                  className={cn(
                    styles.th,
                    column.sortable && styles.sortable,
                    column.align && styles[`align${column.align.charAt(0).toUpperCase() + column.align.slice(1)}`],
                    column.sticky && styles[`sticky${column.sticky.charAt(0).toUpperCase() + column.sticky.slice(1)}`]
                  )}
                  style={{
                    width: column.width,
                    minWidth: column.minWidth,
                  }}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <div className={styles.thContent}>
                    <span>{column.header}</span>
                    {column.sortable && (
                      <span className={cn(
                        styles.sortIcon,
                        currentSort?.columnId === column.id && styles.sorted,
                        currentSort?.columnId === column.id && currentSort.direction === 'desc' && styles.desc
                      )}>
                        ↑
                      </span>
                    )}
                  </div>
                </th>
              ))}
              {rowActions && (
                <th className={cn(styles.th, styles.actionsColumn)}>
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {loading && (
              <tr>
                <td 
                  colSpan={columns.filter(col => !col.hidden).length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)}
                  className={styles.loadingCell}
                >
                  <div className={styles.loading}>Cargando...</div>
                </td>
              </tr>
            )}
            {!loading && displayData.length === 0 && (
              <tr>
                <td 
                  colSpan={columns.filter(col => !col.hidden).length + (selectable ? 1 : 0) + (rowActions ? 1 : 0)}
                  className={styles.emptyCell}
                >
                  <div className={styles.emptyMessage}>{emptyMessage}</div>
                </td>
              </tr>
            )}
            {!loading && displayData.length > 0 && displayData.map((row, index) => {
              const rowId = `row-${index}`;
              return (
                <tr
                  key={rowId}
                  className={cn(
                    styles.tr,
                    selectedRows.some(selected => selected === row) && styles.selected,
                    onRowClick && styles.clickable
                  )}
                  onClick={() => onRowClick?.(row, index)}
                >
                  {selectable && (
                    <td className={styles.td}>
                      <Checkbox
                        checked={selectedRows.some(selected => selected === row)}
                        onChange={(checked) => handleRowSelect(row, checked)}
                        size={size}
                      />
                    </td>
                  )}
                  {columns.filter(col => !col.hidden).map((column) => {
                    let cellContent: React.ReactNode = '';
                    
                    if (column.cell) {
                      const value = column.accessor ? row[column.accessor] : undefined;
                      cellContent = column.cell(value, row, index);
                    } else if (column.accessor) {
                      cellContent = String(row[column.accessor] || '');
                    }
                    
                    return (
                      <td
                        key={column.id}
                        className={cn(
                          styles.td,
                          column.align && styles[`align${column.align.charAt(0).toUpperCase() + column.align.slice(1)}`],
                          column.sticky && styles[`sticky${column.sticky.charAt(0).toUpperCase() + column.sticky.slice(1)}`]
                        )}
                      >
                        {cellContent}
                      </td>
                    );
                  })}
                  {rowActions && (
                    <td className={cn(styles.td, styles.actionsCell)}>
                      {rowActions(row, index)}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {pagination && totalPages > 1 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Mostrando {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, totalItems || sortedData.length)} de {totalItems || sortedData.length}
          </div>
          <div className={styles.paginationControls}>
            <Button
              variant="secondary"
              size="small"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Anterior
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(pageNum => 
                pageNum === 1 || 
                pageNum === totalPages || 
                (pageNum >= page - 2 && pageNum <= page + 2)
              )
              .map((pageNum, idx, arr) => (
                <React.Fragment key={pageNum}>
                  {idx > 0 && arr[idx - 1] !== pageNum - 1 && (
                    <span className={styles.ellipsis}>...</span>
                  )}
                  <Button
                    variant={pageNum === page ? 'primary' : 'secondary'}
                    size="small"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                </React.Fragment>
              ))}
            <Button
              variant="secondary"
              size="small"
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});

DataTable.displayName = 'DataTable';
