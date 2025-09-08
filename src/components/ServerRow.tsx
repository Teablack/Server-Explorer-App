import styles from './ServerList.module.css';
import type { Server } from '../types/server';
import { getCountryFlag } from '../utils/serverUtils';

interface ServerRowProps {
  server: Server;
}

export function ServerRow({ server }: ServerRowProps) {
  const flag = getCountryFlag(server.name);
  const countryName = server.name.replace(/#\d+$/, '').trim();

  return (
    <tr key={server.name} className={styles.tableRow}>
      <td className={styles.tableCell}>
        <div className={styles.countryCell}>
          <span
            className={styles.flag}
            role="img"
            aria-label={`${countryName} flag`}
          >
            {flag}
          </span>
          <span className={styles.countryName}>{server.name}</span>
        </div>
      </td>
      <td className={`${styles.tableCell} ${styles.distance}`}>
        <span aria-label={`Distance: ${server.distance.toString()} kilometers`}>
          {server.distance} km
        </span>
      </td>
    </tr>
  );
}
