import { TokenService } from '../utils/tokenService';
import styles from './Header.module.css';
import developerSvg from '../assets/developer.svg';

interface HeaderProps {
  onLogout: () => void;
}

function Header({ onLogout }: HeaderProps) {
  const handleLogout = () => {
    TokenService.clearToken();
    onLogout();
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <img
          src={developerSvg}
          alt="Developer Logo"
          className={styles.logoImage}
        />
      </div>
      <button onClick={handleLogout} className={styles.logoutButton}>
        Log out
      </button>
    </header>
  );
}

export default Header;
