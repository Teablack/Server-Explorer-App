import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import ServerList from './components/ServerList';
import { TokenService } from './utils/tokenService';
import { ApiService } from './utils/apiService';
import type { Server } from './types/server';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = loading
  const [servers, setServers] = useState<Server[]>([]);

  const fetchServersAndAuthenticate = async () => {
    try {
      const serverData: Server[] = await ApiService.getServers();

      if (serverData.length === 0) {
        setServers([]);
        setIsAuthenticated(true);
        return;
      }

      const uniqueServers = serverData.filter(
        (server: Server, index: number, self: Server[]) =>
          index === self.findIndex((s: Server) => s.name === server.name)
      );
      setServers(uniqueServers);
      setIsAuthenticated(true);
    } catch (error) {
      if (error instanceof Error && error.message === 'Unauthorized') {
        setIsAuthenticated(false);
      } else {
        setServers([]);
        setIsAuthenticated(true);
      }
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      if (!TokenService.hasToken()) {
        setIsAuthenticated(false);
        return;
      }

      await fetchServersAndAuthenticate();
    };

    void checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="container">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={fetchServersAndAuthenticate} />;
  }

  return (
    <div className="app-container">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header
        onLogout={() => {
          setIsAuthenticated(false);
        }}
      />
      <main className="main-content" id="main-content">
        <ServerList servers={servers} />
      </main>
    </div>
  );
}

export default App;
