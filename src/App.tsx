import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import LoadingSpinner from './components/LoadingSpinner';
import Header from './components/Header';
import ServerList from './components/ServerList';
import { TokenService } from './utils/tokenService';
import { ApiService } from './utils/apiService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null); // null = loading
  const [servers, setServers] = useState<any[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      if (!TokenService.hasToken()) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const serverData = await ApiService.getServers();
        setServers(serverData);
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
