import styles from './ServerList.module.css';
import type { Server } from '../types/server';
import { useTableSort } from '../hooks/useTableSort';
import { TableHeader } from './TableHeader';
import { ServerRow } from './ServerRow';

interface ServerListProps {
  servers: Server[];
}

function ServerList({ servers }: ServerListProps) {
  const { sortedItems: sortedServers, handleSort, getSortIcon } = useTableSort(servers);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Server list</h1>
      <p className={styles.description}>
        The distance between you and the server
      </p>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <TableHeader onSort={handleSort} getSortIcon={getSortIcon} />
          <tbody>
            {sortedServers.map((server) => (
              <ServerRow key={server.name} server={server} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ServerList;
