import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { TokenService } from '../tokenService';

describe('TokenService', () => {
  const mockToken = 'mock-token-12345';
  const tokenKey = 'authToken';

  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  describe('Token Storage', () => {
    it('should store token in sessionStorage', () => {
      TokenService.setToken(mockToken);

      expect(sessionStorage.getItem(tokenKey)).toBe(mockToken);
    });

    it('should retrieve token from sessionStorage', () => {
      sessionStorage.setItem(tokenKey, mockToken);

      const retrievedToken = TokenService.getToken();
      expect(retrievedToken).toBe(mockToken);
    });

    it('should return null when no token exists', () => {
      const retrievedToken = TokenService.getToken();
      expect(retrievedToken).toBeNull();
    });

    it('should clear token from sessionStorage', () => {
      sessionStorage.setItem(tokenKey, mockToken);
      expect(sessionStorage.getItem(tokenKey)).toBe(mockToken);

      TokenService.clearToken();
      expect(sessionStorage.getItem(tokenKey)).toBeNull();
    });
  });

  describe('Token Validation', () => {
    it('should return true when token exists', () => {
      sessionStorage.setItem(tokenKey, mockToken);

      expect(TokenService.hasToken()).toBe(true);
    });

    it('should return false when no token exists', () => {
      expect(TokenService.hasToken()).toBe(false);
    });

    it('should return false after token is cleared', () => {
      sessionStorage.setItem(tokenKey, mockToken);
      expect(TokenService.hasToken()).toBe(true);

      TokenService.clearToken();
      expect(TokenService.hasToken()).toBe(false);
    });
  });

  describe('Authorization Header Generation', () => {
    it('should generate auth header with Bearer token', () => {
      sessionStorage.setItem(tokenKey, mockToken);

      const authHeader = TokenService.getAuthHeader();
      expect(authHeader).toEqual({
        Authorization: `Bearer ${mockToken}`,
      });
    });

    it('should return empty object when no token exists', () => {
      const authHeader = TokenService.getAuthHeader();
      expect(authHeader).toEqual({});
    });

    it('should return updated header after token change', () => {
      TokenService.setToken('initial-token');
      let authHeader = TokenService.getAuthHeader();
      expect(authHeader).toEqual({
        Authorization: 'Bearer initial-token',
      });

      TokenService.setToken('updated-token');
      authHeader = TokenService.getAuthHeader();
      expect(authHeader).toEqual({
        Authorization: 'Bearer updated-token',
      });
    });

    it('should return empty object after token is cleared', () => {
      sessionStorage.setItem(tokenKey, mockToken);
      expect(TokenService.getAuthHeader()).toEqual({
        Authorization: `Bearer ${mockToken}`,
      });

      TokenService.clearToken();
      expect(TokenService.getAuthHeader()).toEqual({});
    });
  });
});
