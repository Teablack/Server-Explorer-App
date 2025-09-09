import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock environment variables
Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_URL: 'https://playground.tesonet.lt',
  },
  writable: true,
});

// Mock sessionStorage
const mockSessionStorage = {
  store: new Map<string, string>(),
  getItem: (key: string) => mockSessionStorage.store.get(key) ?? null,
  setItem: (key: string, value: string) => {
    mockSessionStorage.store.set(key, value);
  },
  removeItem: (key: string) => {
    mockSessionStorage.store.delete(key);
  },
  clear: () => {
    mockSessionStorage.store.clear();
  },
};

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

// Mock window.location.reload
const mockReload = vi.fn();
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    reload: mockReload,
  },
  writable: true,
});
