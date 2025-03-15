import { useContext } from 'react';
import { AuthContext } from '@/context/AuthProvider';

export default function AuthStatus() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return null;

  return (
    <div style={styles.container}>
      <span style={styles.email}>{user.email}</span>
      <button onClick={logout} style={styles.logoutButton}>
        Cerrar sesión
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px',
  },
  email: {
    fontSize: '14px',
    color: '#333',
  },
  logoutButton: {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
} as const;