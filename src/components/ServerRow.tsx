import styles from './ServerList.module.css';
import type { Server } from '../types/server';
import { getCountryFlag } from '../utils/serverUtils';

interface ServerRowProps {
  server: Server;
}

export function ServerRow({ server }: ServerRowProps) {
  const flag = getCountryFlag(server.name);

  return (
    <tr key={server.name} className={styles.tableRow}>
      <td className={styles.tableCell}>
        <div className={styles.countryCell}>
          <span className={styles.flag}>{flag}</span>
          <span className={styles.countryName}>{server.name}</span>
        </div>
      </td>
      <td className={`${styles.tableCell} ${styles.distance}`}>
        {server.distance} km
      </td>
    </tr>
  );
}
