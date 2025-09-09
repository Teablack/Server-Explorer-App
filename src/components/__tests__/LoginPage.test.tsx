import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginPage from '../LoginPage';
import { TokenService } from '../../utils/tokenService';
import { ApiService } from '../../utils/apiService';
import { createFetchMock } from '../../test/mocks';

vi.mock('../../utils/tokenService');
vi.mock('../../utils/apiService');

const mockTokenService = vi.mocked(TokenService);
const mockApiService = vi.mocked(ApiService);

describe('LoginPage', () => {
  const mockOnLoginSuccess = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    window.fetch = createFetchMock();
  });

  describe('Form Rendering', () => {
    it('should render login form with all required elements', () => {
      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);

      expect(screen.getByText('Welcome back!')).toBeInTheDocument();
      expect(
        screen.getByText('Enter details below to log in to your account.')
      ).toBeInTheDocument();
      expect(screen.getByLabelText('Username')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /log in/i })
      ).toBeInTheDocument();
    });

    it('should have proper form accessibility attributes', () => {
      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);

      const form = screen.getByRole('form');
      expect(form).toHaveAttribute('aria-labelledby', 'welcome-title');
      expect(form).toHaveAttribute('aria-describedby', 'welcome-subtitle');
      expect(form).toHaveAttribute('noValidate');

      const usernameInput = screen.getByLabelText('Username');
      expect(usernameInput).toHaveAttribute('required');
      expect(usernameInput).toHaveAttribute('type', 'text');

      const passwordInput = screen.getByLabelText('Password');
      expect(passwordInput).toHaveAttribute('required');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });
  });

  describe('Form Validation', () => {
    it('should show validation errors for empty fields', async () => {
      const user = userEvent.setup();
      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);

      const submitButton = screen.getByRole('button', { name: /log in/i });
      await user.click(submitButton);

      expect(screen.getAllByText('This field is required')).toHaveLength(2);
      expect(screen.getAllByRole('alert')).toHaveLength(2);

      const usernameInput = screen.getByLabelText('Username');
      const passwordInput = screen.getByLabelText('Password');

      expect(usernameInput).toHaveAttribute('aria-invalid', 'true');
      expect(passwordInput).toHaveAttribute('aria-invalid', 'true');
      expect(usernameInput).toHaveAttribute(
        'aria-describedby',
        'username-error'
      );
      expect(passwordInput).toHaveAttribute(
        'aria-describedby',
        'password-error'
      );
    });

    it('should clear field errors when user types in empty fields', async () => {
      const user = userEvent.setup();
      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);

      const submitButton = screen.getByRole('button', { name: /log in/i });
      await user.click(submitButton);

      expect(screen.getAllByText('This field is required')).toHaveLength(2);

      const usernameInput = screen.getByLabelText('Username');
      await user.type(usernameInput, 'test');

      expect(screen.getAllByText('This field is required')).toHaveLength(1);
      expect(usernameInput).toHaveAttribute('aria-invalid', 'false');
      expect(usernameInput).not.toHaveAttribute('aria-describedby');
    });

    it('should not clear field errors when typing only whitespace', async () => {
      const user = userEvent.setup();
      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);

      const submitButton = screen.getByRole('button', { name: /log in/i });
      await user.click(submitButton);

      const usernameInput = screen.getByLabelText('Username');
      await user.type(usernameInput, '   ');

      expect(screen.getAllByText('This field is required')).toHaveLength(2);
    });
  });

  describe('Successful Login Flow', () => {
    it('should handle successful login', async () => {
      const user = userEvent.setup();
      const mockToken = 'mock-jwt-token';

      mockApiService.login.mockResolvedValue(mockToken);

      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);

      await user.type(screen.getByLabelText('Username'), 'tesonet');
      await user.type(screen.getByLabelText('Password'), 'partyanimal');

      const submitButton = screen.getByRole('button', { name: /log in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockApiService.login).toHaveBeenCalledWith(
          'tesonet',
          'partyanimal'
        );
        expect(mockTokenService.setToken).toHaveBeenCalledWith(mockToken);
        expect(mockOnLoginSuccess).toHaveBeenCalled();
      });
    });

    it('should show loading state during login', async () => {
      const user = userEvent.setup();

      mockApiService.login.mockImplementation(
        () =>
          new Promise((resolve) => setTimeout(() => resolve('mock-token'), 100))
      );

      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);

      await user.type(screen.getByLabelText('Username'), 'tesonet');
      await user.type(screen.getByLabelText('Password'), 'partyanimal');

      const submitButton = screen.getByRole('button', { name: /log in/i });
      await user.click(submitButton);

      expect(screen.getByText('Logging in')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();

      await waitFor(() => {
        expect(mockOnLoginSuccess).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message on login failure', async () => {
      const user = userEvent.setup();
      const errorMessage = "Username or password isn't correct";

      mockApiService.login.mockRejectedValue(new Error(errorMessage));

      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);

      await user.type(screen.getByLabelText('Username'), 'wrong');
      await user.type(screen.getByLabelText('Password'), 'credentials');

      const submitButton = screen.getByRole('button', { name: /log in/i });
      await user.click(submitButton);

      await waitFor(() => {
        const errorElement = screen.getByRole('alert');
        expect(errorElement).toHaveTextContent(errorMessage);
        expect(errorElement).toHaveAttribute('aria-live', 'polite');
      });

      expect(mockOnLoginSuccess).not.toHaveBeenCalled();
    });

    it('should handle generic error messages', async () => {
      const user = userEvent.setup();

      mockApiService.login.mockRejectedValue(new Error('Network error'));

      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);

      await user.type(screen.getByLabelText('Username'), 'tesonet');
      await user.type(screen.getByLabelText('Password'), 'partyanimal');

      const submitButton = screen.getByRole('button', { name: /log in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument();
      });
    });

    it('should handle non-Error exceptions', async () => {
      const user = userEvent.setup();

      mockApiService.login.mockRejectedValue('String error');

      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);

      await user.type(screen.getByLabelText('Username'), 'tesonet');
      await user.type(screen.getByLabelText('Password'), 'partyanimal');

      const submitButton = screen.getByRole('button', { name: /log in/i });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText('Login failed. Please try again.')
        ).toBeInTheDocument();
      });
    });
  });

  describe('Keyboard Navigation', () => {
    it('should support keyboard navigation through form', async () => {
      const user = userEvent.setup();
      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);

      await user.tab();
      expect(screen.getByLabelText('Username')).toHaveFocus();

      await user.tab();
      expect(screen.getByLabelText('Password')).toHaveFocus();

      await user.tab();
      expect(screen.getByRole('button', { name: /log in/i })).toHaveFocus();
    });

    it('should submit form with Enter key', async () => {
      const user = userEvent.setup();
      mockApiService.login.mockResolvedValue('mock-token');

      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);

      const usernameInput = screen.getByLabelText('Username');
      await user.type(usernameInput, 'tesonet');
      await user.type(screen.getByLabelText('Password'), 'partyanimal');

      await user.keyboard('{Enter}');

      await waitFor(() => {
        expect(mockApiService.login).toHaveBeenCalled();
      });
    });
  });

  describe('Accessibility Features', () => {
    it('should have proper ARIA labels and descriptions', () => {
      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);

      expect(
        screen.getByRole('heading', { name: 'Welcome back!' })
      ).toHaveAttribute('id', 'welcome-title');

      const subtitle = screen.getByText(
        'Enter details below to log in to your account.'
      );
      expect(subtitle).toHaveAttribute('id', 'welcome-subtitle');
    });

    it('should announce errors to screen readers', async () => {
      const user = userEvent.setup();
      mockApiService.login.mockRejectedValue(new Error('Login failed'));

      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);

      await user.type(screen.getByLabelText('Username'), 'test');
      await user.type(screen.getByLabelText('Password'), 'test');
      await user.click(screen.getByRole('button', { name: /log in/i }));

      await waitFor(() => {
        const errorAlert = screen.getByRole('alert');
        expect(errorAlert).toHaveAttribute('aria-live', 'polite');
        expect(errorAlert).toHaveTextContent('Login failed');
      });
    });

    it('should have proper error associations with form fields', async () => {
      const user = userEvent.setup();
      render(<LoginPage onLoginSuccess={mockOnLoginSuccess} />);

      await user.click(screen.getByRole('button', { name: /log in/i }));

      const usernameError = document.getElementById('username-error');
      const passwordError = document.getElementById('password-error');

      expect(usernameError).toBeInTheDocument();
      expect(passwordError).toBeInTheDocument();
      expect(usernameError).toHaveAttribute('role', 'alert');
      expect(passwordError).toHaveAttribute('role', 'alert');
      expect(usernameError).toHaveTextContent('This field is required');
      expect(passwordError).toHaveTextContent('This field is required');
    });
  });
});
