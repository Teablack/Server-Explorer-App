export class TokenService {
  private static readonly TOKEN_KEY = 'authToken';

  static setToken(token: string): void {
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }

  static clearToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
  }

  static hasToken(): boolean {
    return this.getToken() !== null;
  }

  static getAuthHeader(): Record<string, string> {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}
