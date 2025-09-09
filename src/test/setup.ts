import '@testing-library/jest-dom';

Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_API_URL: 'https://playground.tesonet.lt',
  },
  writable: true,
});

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
