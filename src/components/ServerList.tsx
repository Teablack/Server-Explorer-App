import styles from './ServerList.module.css';
import type { Server } from '../types/server';
import { useTableSort } from '../hooks/useTableSort';
import { TableHeader } from './TableHeader';
import { ServerRow } from './ServerRow';

interface ServerListProps {
  servers: Server[];
}

function ServerList({ servers }: ServerListProps) {
  const {
    sortedItems: sortedServers,
    handleSort,
    getSortIcon,
    sortField,
    sortDirection,
  } = useTableSort(servers);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Server list</h1>
      <p className={styles.description}>
        The distance between you and the server
      </p>

      {servers.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon} aria-hidden="true">
            📡
          </div>
          <h2 className={styles.emptyTitle}>No servers available</h2>
          <p className={styles.emptyDescription}>
            There are currently no servers to display. Please check back later
            or contact support if this issue persists.
          </p>
        </div>
      ) : (
        <>
          <div className="sr-only" aria-live="polite" aria-atomic="true">
            {`Table sorted by ${sortField === 'name' ? 'country name' : 'distance'} in ${sortDirection === 'asc' ? 'ascending' : 'descending'} order`}
          </div>

          <div className={styles.tableContainer}>
            <table
              className={styles.table}
              role="table"
              aria-label="Server list with country names and distances"
            >
              <TableHeader onSort={handleSort} getSortIcon={getSortIcon} />
              <tbody>
                {sortedServers.map((server) => (
                  <ServerRow key={server.name} server={server} />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default ServerList;
