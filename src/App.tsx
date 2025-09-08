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

  useEffect(() => {
    const checkAuth = async () => {
      if (!TokenService.hasToken()) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const serverData: Server[] = await ApiService.getServers();

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
          setIsAuthenticated(true);
        }
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return (
      <div className="container">
        <LoadingSpinner />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => window.location.reload()} />;
  }

  return (
    <div className="app-container">
      <Header onLogout={() => setIsAuthenticated(false)} />
      <div className="main-content">
        <ServerList servers={servers} />
      </div>
    </div>
  );
}

export default App;
