import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { TokenService } from '../utils/tokenService';
import { ApiService } from '../utils/apiService';
import { createFetchMock, mockServers } from '../test/mocks';

vi.mock('../utils/tokenService');
vi.mock('../utils/apiService');

const mockTokenService = vi.mocked(TokenService);
const mockApiService = vi.mocked(ApiService);

describe('App Authentication Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();

    window.fetch = createFetchMock();
  });

  describe('when user is not authenticated', () => {
    beforeEach(() => {
      mockTokenService.hasToken.mockReturnValue(false);
    });

    it('should display login page', () => {
      render(<App />);

      expect(screen.getByText('Welcome back!')).toBeInTheDocument();
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /log in/i })
      ).toBeInTheDocument();
    });

    it('should show loading state initially', () => {
      mockTokenService.hasToken.mockReturnValue(true);
      mockApiService.getServers.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<App />);

      expect(
        screen.getByRole('status', { name: /loading content/i })
      ).toBeInTheDocument();
      expect(
        screen.getByText('Loading content, please wait...')
      ).toBeInTheDocument();
    });
  });

  describe('when user is authenticated', () => {
    beforeEach(() => {
      mockTokenService.hasToken.mockReturnValue(true);
      mockApiService.getServers.mockResolvedValue(mockServers);
    });

    it('should display server list after authentication', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Server list')).toBeInTheDocument();
      });

      expect(
        screen.getByText('The distance between you and the server')
      ).toBeInTheDocument();
      expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should display skip navigation link', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Skip to main content')).toBeInTheDocument();
      });
    });

    it('should have proper ARIA landmarks', async () => {
      render(<App />);

      await waitFor(() => {
        expect(screen.getByRole('banner')).toBeInTheDocument();
        expect(screen.getByRole('main')).toBeInTheDocument();
      });
    });
  });

  describe('authentication error handling', () => {
    it('should redirect to login when API returns 401', async () => {
      mockTokenService.hasToken.mockReturnValue(true);
      mockApiService.getServers.mockRejectedValue(new Error('Unauthorized'));

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Welcome back!')).toBeInTheDocument();
      });
    });

    it('should stay authenticated on other API errors', async () => {
      mockTokenService.hasToken.mockReturnValue(true);
      mockApiService.getServers.mockRejectedValue(new Error('Network error'));

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Server list')).toBeInTheDocument();
      });
    });
  });

  describe('logout functionality', () => {
    beforeEach(() => {
      mockTokenService.hasToken.mockReturnValue(true);
      mockApiService.getServers.mockResolvedValue(mockServers);
    });

    it('should handle logout', async () => {
      render(<App />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /log out/i })
        ).toBeInTheDocument();
      });

      const logoutButton = screen.getByRole('button', { name: /log out/i });
      await userEvent.click(logoutButton);

      expect(mockTokenService.clearToken).toHaveBeenCalled();
      expect(screen.getByText('Welcome back!')).toBeInTheDocument();
    });
  });

  describe('server data deduplication', () => {
    it('should remove duplicate servers by name', async () => {
      const duplicateServers = [
        { name: 'United States #1', distance: 1500 },
        { name: 'Denmark #2', distance: 500 },
        { name: 'United States #1', distance: 1600 },
        { name: 'Finland #3', distance: 300 },
      ];

      mockTokenService.hasToken.mockReturnValue(true);
      mockApiService.getServers.mockResolvedValue(duplicateServers);

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Server list')).toBeInTheDocument();
      });

      const serverRows = screen.getAllByRole('row');
      expect(serverRows).toHaveLength(4);
    });
  });

  describe('accessibility features', () => {
    beforeEach(() => {
      mockTokenService.hasToken.mockReturnValue(true);
      mockApiService.getServers.mockResolvedValue(mockServers);
    });

    it('should have proper page structure for screen readers', async () => {
      render(<App />);

      await waitFor(() => {
        const main = screen.getByRole('main');
        expect(main).toHaveAttribute('id', 'main-content');
      });
    });
  });
});
