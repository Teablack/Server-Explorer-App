const TOKEN_KEY = 'authToken';

export const TokenService = {
  setToken(token: string): void {
    sessionStorage.setItem(TOKEN_KEY, token);
  },

  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY);
  },

  clearToken(): void {
    sessionStorage.removeItem(TOKEN_KEY);
  },

  hasToken(): boolean {
    return this.getToken() !== null;
  },

  getAuthHeader(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};
