import { vi } from 'vitest';

export const mockServer = {
  name: 'United States #1',
  distance: 1500,
};

export const mockServers = [
  { name: 'United States #1', distance: 1500 },
  { name: 'Denmark #2', distance: 500 },
  { name: 'Finland #3', distance: 300 },
  { name: 'Sweden #4', distance: 400 },
];

export const mockLoginResponse = {
  token: 'mock-jwt-token-12345',
};

export const mockApiService = {
  login: vi.fn(),
  getServers: vi.fn(),
};

export const createFetchMock = () => {
  return vi.fn().mockImplementation((url: string, options?: RequestInit) => {
    const method = options?.method ?? 'GET';

    if (url.includes('/v1/tokens') && method === 'POST') {
      const body = options?.body ? JSON.parse(options.body as string) : {};

      if (
        (body as { username: string; password: string }).username ===
          'tesonet' &&
        (body as { username: string; password: string }).password ===
          'partyanimal'
      ) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockLoginResponse),
        });
      } else {
        return Promise.resolve({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ error: 'Unauthorized' }),
        });
      }
    }

    if (url.includes('/v1/servers') && method === 'GET') {
      const hasValidToken =
        options?.headers &&
        (options.headers as Record<string, string>).Authorization;

      if (hasValidToken) {
        return Promise.resolve({
          ok: true,
          status: 200,
          json: () => Promise.resolve(mockServers),
        });
      } else {
        return Promise.resolve({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ error: 'Unauthorized' }),
        });
      }
    }

    return Promise.reject(new Error('Unknown API endpoint'));
  });
};
