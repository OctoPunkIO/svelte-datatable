export interface Column<T> {
  key: string;
  header: string;
  accessor: (row: T) => unknown;
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: unknown, row: T) => string;
}

export interface SortState<T> {
  column: Column<T>;
  direction: 'asc' | 'desc';
}

export interface SelectionState<T> {
  selected: T[];
}

export interface PaginationConfig {
  pageSize: number;
  pageSizeOptions?: number[];
  showPageSizeSelector?: boolean;
}