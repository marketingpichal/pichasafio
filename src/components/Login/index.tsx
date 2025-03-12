import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  interface SupabaseAuthResponse {
    data: {
      user: any;
    };
    error: {
      message: string;
    } | null;
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const { data, error }: SupabaseAuthResponse = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    
    if (error) {
      setError(error.message);
    } else {
      console.log('Usuario logueado:', data.user);
      // Redirect to Routines component
      navigate('/rutinas');
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Iniciar Sesión</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          style={styles.input}
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
          style={styles.input}
        />
        <button type="submit" disabled={loading} style={loading ? { ...styles.button, ...styles.buttonDisabled } : styles.button}>
          {loading ? 'Cargando...' : 'Iniciar sesión'}
        </button>
        {error && <p style={styles.errorMessage}>{error}</p>}
      </form>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#f7f7f7',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    maxWidth: '400px',
    margin: '0 auto',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#333',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
  },
  input: {
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
  errorMessage: {
    color: 'red',
    marginTop: '10px',
    textAlign: 'center',
  },
};