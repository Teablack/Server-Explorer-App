import styles from './LoadingSpinner.module.css';

function LoadingSpinner() {
  return (
    <div className={styles.container}>
      <div 
        className={styles.spinner}
        role="status"
        aria-label="Loading content"
      ></div>
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  );
}

export default LoadingSpinner;
