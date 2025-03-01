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
    <div>
      <h2>Registrarse</h2>
      {success ? (
        <p>¡Registro exitoso! Por favor, revisa tu correo para confirmar tu cuenta.</p>
      ) : (
        <form onSubmit={handleRegister}>
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
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Nombre de usuario"
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Cargando...' : 'Registrarse'}
          </button>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
      )}
    </div>
  );
}