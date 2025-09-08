import styles from './ServerList.module.css';
import type { SortField } from '../hooks/useTableSort';

interface TableHeaderProps {
  onSort: (field: SortField) => void;
  getSortIcon: (field: SortField) => string;
}

export function TableHeader({ onSort, getSortIcon }: TableHeaderProps) {
  return (
    <thead className={styles.tableHeader}>
      <tr>
        <th
          className={`${styles.headerCell} ${styles.sortable}`}
          onClick={() => onSort('name')}
        >
          Country name
          <span className={styles.sortIcon}>{getSortIcon('name')}</span>
        </th>
        <th
          className={`${styles.headerCell} ${styles.sortable}`}
          onClick={() => onSort('distance')}
        >
          Distance
          <span className={styles.sortIcon}>{getSortIcon('distance')}</span>
        </th>
      </tr>
    </thead>
  );
}
