import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

interface LoginFormProps {
    email: string;
    password: string;
}

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
        // Aquí puedes redirigir, por ejemplo: window.location.href = '/dashboard';
    }
};

  return (
    <div>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Contraseña"
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Cargando...' : 'Iniciar sesión'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    </div>
  );
}