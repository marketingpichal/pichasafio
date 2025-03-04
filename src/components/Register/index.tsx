import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface AuthResponse {
  data: {
    user: any | null;
    session: any | null;
  };
  error: any | null;
}

interface ProfileResponse {
  error: any | null;
}

export default function Register() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Registrar al usuario con Supabase Auth
      const { data: authData, error: authError }: AuthResponse = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username }, // Pasar el username como metadato (opcional)
        },
      });

      if (authError) throw authError;

      const user = authData.user;

      if (!user) throw new Error('No se pudo registrar el usuario.');

      // 2. Insertar datos adicionales en la tabla profiles
      const { error: profileError }: ProfileResponse = await supabase
        .from('profiles')
        .insert({
          id: user.id, // Vinculamos con el ID del usuario en auth.users
          username,
          email: user.email,
          created_at: new Date().toISOString(), // O puedes dejar que el default lo maneje
        });

      if (profileError) {
        // Si falla la inserción en profiles, podrías eliminar el usuario de auth.users
        await supabase.auth.admin.deleteUser(user.id);
        throw profileError;
      }

      setSuccess(true);
      console.log('Usuario registrado:', user);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Registrarse</h2>
      {success ? (
        <p style={styles.successMessage}>¡Registro exitoso! Por favor, revisa tu correo para confirmar tu cuenta.</p>
      ) : (
        <form onSubmit={handleRegister} style={styles.form}>
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
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nombre de usuario"
            required
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Cargando...' : 'Registrarse'}
          </button>
          {error && <p style={styles.errorMessage}>{error}</p>}
        </form>
      )}
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
    textAlign: 'center' as 'center',
  },
  successMessage: {
    color: 'green',
    marginTop: '10px',
    textAlign: 'center',
  },
};