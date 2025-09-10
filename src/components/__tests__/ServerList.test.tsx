import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ServerList from '../ServerList';
import type { Server } from '../../types/server';

const mockServers: Server[] = [
  { name: 'United States #1', distance: 1500 },
  { name: 'Denmark #2', distance: 500 },
  { name: 'Finland #3', distance: 300 },
];

describe('ServerList', () => {
  describe('with servers data', () => {
    it('should render server list with data', () => {
      render(<ServerList servers={mockServers} />);

      expect(screen.getByText('Server list')).toBeInTheDocument();
      expect(
        screen.getByText('The distance between you and the server')
      ).toBeInTheDocument();

      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getByText('Country name')).toBeInTheDocument();
      expect(screen.getByText('Distance')).toBeInTheDocument();

      mockServers.forEach((server) => {
        expect(screen.getByText(server.name)).toBeInTheDocument();
        expect(screen.getByText(`${server.distance} km`)).toBeInTheDocument();
      });
    });

    it('should have proper accessibility attributes', () => {
      render(<ServerList servers={mockServers} />);

      const table = screen.getByRole('table');
      expect(table).toHaveAttribute(
        'aria-label',
        'Server list with country names and distances'
      );

      const sortButtons = screen.getAllByRole('button');
      expect(sortButtons).toHaveLength(2);
      expect(sortButtons[0]).toHaveAttribute(
        'aria-label',
        'Sort by country name'
      );
      expect(sortButtons[1]).toHaveAttribute('aria-label', 'Sort by distance');
    });
  });

  describe('with empty servers array', () => {
    it('should render empty state when no servers provided', () => {
      render(<ServerList servers={[]} />);

      expect(screen.getByText('Server list')).toBeInTheDocument();
      expect(
        screen.getByText('The distance between you and the server')
      ).toBeInTheDocument();

      expect(screen.getByText('No servers available')).toBeInTheDocument();
      expect(
        screen.getByText(
          'There are currently no servers to display. Please check back later or contact support if this issue persists.'
        )
      ).toBeInTheDocument();

      expect(screen.queryByRole('table')).not.toBeInTheDocument();
    });
  });
});
