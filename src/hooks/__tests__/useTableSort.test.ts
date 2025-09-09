import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTableSort } from '../useTableSort';
import type { Server } from '../../types/server';

const mockServers: Server[] = [
  { name: 'United States #1', distance: 1500 },
  { name: 'Denmark #2', distance: 500 },
  { name: 'Finland #3', distance: 300 },
  { name: 'Sweden #4', distance: 400 },
  { name: 'Australia #5', distance: 2000 },
];

describe('useTableSort', () => {
  describe('initial state', () => {
    it('should have default initial sort (name, desc)', () => {
      const { result } = renderHook(() => useTableSort(mockServers));

      expect(result.current.sortField).toBe('name');
      expect(result.current.sortDirection).toBe('desc');
    });

    it('should accept custom initial sort parameters', () => {
      const { result } = renderHook(() =>
        useTableSort(mockServers, 'distance', 'asc')
      );

      expect(result.current.sortField).toBe('distance');
      expect(result.current.sortDirection).toBe('asc');
    });

    it('should sort items by default field and direction', () => {
      const { result } = renderHook(() => useTableSort(mockServers));

      const sortedNames = result.current.sortedItems.map((item) => item.name);
      expect(sortedNames).toEqual([
        'United States #1',
        'Sweden #4',
        'Finland #3',
        'Denmark #2',
        'Australia #5',
      ]);
    });
  });

  describe('sorting by name', () => {
    it('should sort by name ascending', () => {
      const { result } = renderHook(() =>
        useTableSort(mockServers, 'name', 'asc')
      );

      const sortedNames = result.current.sortedItems.map((item) => item.name);
      expect(sortedNames).toEqual([
        'Australia #5',
        'Denmark #2',
        'Finland #3',
        'Sweden #4',
        'United States #1',
      ]);
    });

    it('should sort by name descending', () => {
      const { result } = renderHook(() =>
        useTableSort(mockServers, 'name', 'desc')
      );

      const sortedNames = result.current.sortedItems.map((item) => item.name);
      expect(sortedNames).toEqual([
        'United States #1',
        'Sweden #4',
        'Finland #3',
        'Denmark #2',
        'Australia #5',
      ]);
    });
  });

  describe('sorting by distance', () => {
    it('should sort by distance ascending', () => {
      const { result } = renderHook(() =>
        useTableSort(mockServers, 'distance', 'asc')
      );

      const sortedDistances = result.current.sortedItems.map(
        (item) => item.distance
      );
      expect(sortedDistances).toEqual([300, 400, 500, 1500, 2000]);
    });

    it('should sort by distance descending', () => {
      const { result } = renderHook(() =>
        useTableSort(mockServers, 'distance', 'desc')
      );

      const sortedDistances = result.current.sortedItems.map(
        (item) => item.distance
      );
      expect(sortedDistances).toEqual([2000, 1500, 500, 400, 300]);
    });

    it('should handle equal distances', () => {
      const equalDistanceServers = [
        { name: 'Server A', distance: 500 },
        { name: 'Server B', distance: 500 },
        { name: 'Server C', distance: 300 },
      ];

      const { result } = renderHook(() =>
        useTableSort(equalDistanceServers, 'distance', 'asc')
      );

      const distances = result.current.sortedItems.map((item) => item.distance);
      expect(distances).toEqual([300, 500, 500]);

      const names = result.current.sortedItems.map((item) => item.name);
      expect(names.slice(1)).toEqual(['Server A', 'Server B']);
    });
  });

  describe('sort interactions', () => {
    it('should toggle direction when clicking same field', () => {
      const { result } = renderHook(() =>
        useTableSort(mockServers, 'name', 'asc')
      );

      expect(result.current.sortDirection).toBe('asc');

      act(() => {
        result.current.handleSort('name');
      });

      expect(result.current.sortField).toBe('name');
      expect(result.current.sortDirection).toBe('desc');

      act(() => {
        result.current.handleSort('name');
      });

      expect(result.current.sortField).toBe('name');
      expect(result.current.sortDirection).toBe('asc');
    });

    it('should change field and set to ascending when clicking different field', () => {
      const { result } = renderHook(() =>
        useTableSort(mockServers, 'name', 'desc')
      );

      expect(result.current.sortField).toBe('name');
      expect(result.current.sortDirection).toBe('desc');

      act(() => {
        result.current.handleSort('distance');
      });

      expect(result.current.sortField).toBe('distance');
      expect(result.current.sortDirection).toBe('asc');
    });

    it('should switch from distance to name correctly', () => {
      const { result } = renderHook(() =>
        useTableSort(mockServers, 'distance', 'desc')
      );

      act(() => {
        result.current.handleSort('name');
      });

      expect(result.current.sortField).toBe('name');
      expect(result.current.sortDirection).toBe('asc');

      const sortedNames = result.current.sortedItems.map((item) => item.name);
      expect(sortedNames).toEqual([
        'Australia #5',
        'Denmark #2',
        'Finland #3',
        'Sweden #4',
        'United States #1',
      ]);
    });
    it('should handle empty array', () => {
      const { result } = renderHook(() => useTableSort([]));

      expect(result.current.sortedItems).toEqual([]);
      expect(result.current.sortField).toBe('name');
      expect(result.current.sortDirection).toBe('desc');
    });
  });
});
