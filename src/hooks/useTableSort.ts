import { useState, useMemo } from 'react';

export type SortField = 'name' | 'distance';
export type SortDirection = 'asc' | 'desc';

interface SortableItem {
  name: string;
  distance: number;
}

export function useTableSort<T extends SortableItem>(
  items: T[],
  initialField: SortField = 'name',
  initialDirection: SortDirection = 'desc'
) {
  const [sortField, setSortField] = useState<SortField>(initialField);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialDirection);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      let comparison = 0;

      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else {
        comparison = a.distance - b.distance;
      }

      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [items, sortField, sortDirection]);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '▼';
    return sortDirection === 'asc' ? '▲' : '▼';
  };

  return {
    sortField,
    sortDirection,
    sortedItems,
    handleSort,
    getSortIcon,
  };
}
