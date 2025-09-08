import styles from './ServerList.module.css';
import type { SortField } from '../hooks/useTableSort';

interface TableHeaderProps {
  onSort: (field: SortField) => void;
  getSortIcon: (field: SortField) => string;
}

export function TableHeader({ onSort, getSortIcon }: TableHeaderProps) {
  const handleKeyDown = (event: React.KeyboardEvent, field: SortField) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSort(field);
    }
  };

  return (
    <thead className={styles.tableHeader}>
      <tr>
        <th
          className={`${styles.headerCell} ${styles.sortable}`}
          onClick={() => { onSort('name'); }}
          onKeyDown={(e) => { handleKeyDown(e, 'name'); }}
          tabIndex={0}
          role="button"
          aria-label="Sort by country name"
          aria-sort={getSortIcon('name') === '▲' ? 'ascending' : getSortIcon('name') === '▼' ? 'descending' : 'none'}
        >
          Country name
          <span className={styles.sortIcon} aria-hidden="true">{getSortIcon('name')}</span>
        </th>
        <th
          className={`${styles.headerCell} ${styles.sortable}`}
          onClick={() => { onSort('distance'); }}
          onKeyDown={(e) => { handleKeyDown(e, 'distance'); }}
          tabIndex={0}
          role="button"
          aria-label="Sort by distance"
          aria-sort={getSortIcon('distance') === '▲' ? 'ascending' : getSortIcon('distance') === '▼' ? 'descending' : 'none'}
        >
          Distance
          <span className={styles.sortIcon} aria-hidden="true">{getSortIcon('distance')}</span>
        </th>
      </tr>
    </thead>
  );
}
