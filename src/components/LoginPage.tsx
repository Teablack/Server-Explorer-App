import { useState } from 'react';
import developerSvg from '../assets/developer.svg';
import { TokenService } from '../utils/tokenService';
import { ApiService } from '../utils/apiService';
import styles from './LoginPage.module.css';

interface FormFieldProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  hasError: boolean;
  onChange: (value: string) => void;
  onClearError: () => void;
}

const FormField = ({
  id,
  label,
  type,
  placeholder,
  value,
  hasError,
  onChange,
  onClearError,
}: FormFieldProps) => (
  <div className={styles.formGroup}>
    <label htmlFor={id} className={styles.formLabel}>
      {label}
    </label>
    <input
      type={type}
      id={id}
      className={`${styles.formInput} ${hasError ? styles.formInputError : ''}`}
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
        if (hasError && e.target.value.trim()) {
          onClearError();
        }
      }}
      aria-invalid={hasError}
      aria-describedby={hasError ? `${id}-error` : undefined}
      required
    />
    {hasError && (
      <div className={styles.fieldError} id={`${id}-error`} role="alert">
        <span className={styles.fieldErrorIcon} aria-hidden="true">⚠</span>
        This field is required
      </div>
    )}
  </div>
);

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

function LoginPage({ onLoginSuccess }: LoginPageProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({
    username: false,
    password: false,
  });

  const validateFields = () => {
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();
    const errors = {
      username: !trimmedUsername,
      password: !trimmedPassword,
    };
    setFieldErrors(errors);
    return !errors.username && !errors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateFields()) {
      return;
    }

    setIsLoading(true);

    try {
      const token = await ApiService.login(username.trim(), password.trim());

      TokenService.setToken(token);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Login failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className={styles.loginCard}>
        <div className={styles.logoContainer}>
          <img src={developerSvg} alt="Developer icon" className={styles.logo} />
        </div>

        {isLoading ? (
          <div className={styles.loaderContent}>
            <div 
              className={styles.loaderSpinner}
              role="progressbar"
              aria-label="Login in progress"
            ></div>
            <p className={styles.loaderText}>Logging in</p>
          </div>
        ) : (
          <>
            <h1 className={styles.welcomeTitle} id="welcome-title">Welcome back!</h1>
            <p className={styles.welcomeSubtitle} id="welcome-subtitle">
              Enter details below to log in to your account.
            </p>

            <form 
              className={styles.loginForm} 
              onSubmit={(e) => { void handleSubmit(e); }} 
              noValidate
              aria-labelledby="welcome-title"
              aria-describedby="welcome-subtitle"
            >
              {error && (
                <div 
                  className={styles.errorMessage} 
                  role="alert" 
                  aria-live="polite"
                >
                  {error}
                </div>
              )}

              <FormField
                id="username"
                label="Username"
                type="text"
                placeholder="Enter username"
                value={username}
                hasError={fieldErrors.username}
                onChange={setUsername}
                onClearError={() => {
                  setFieldErrors((prev) => ({ ...prev, username: false }));
                }}
              />

              <FormField
                id="password"
                label="Password"
                type="password"
                placeholder="Enter password"
                value={password}
                hasError={fieldErrors.password}
                onChange={setPassword}
                onClearError={() => {
                  setFieldErrors((prev) => ({ ...prev, password: false }));
                }}
              />

              <button type="submit" className={styles.loginButton}>
                Log in
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default LoginPage;
