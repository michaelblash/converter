import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { loginAsync, selectAuthStatus, selectIsAuthenticated } from '../store/features/auth/authSlice';
import styles from './styles.module.css';


export default () => {
  const status = useSelector(selectAuthStatus);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    setError('');
    dispatch(loginAsync({
      username,
      password
    })).then(e => {
      if (e.error) {
        setError(e.error.message);
      }
    });
  };

  if (isAuthenticated) {
    return <Navigate to="/" />
  }

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <form className={styles.form} onSubmit={submit}>
        <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="username" />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" />
        <input type="submit" />
      </form>
      <div>{error}</div>
    </div>
  );
};
