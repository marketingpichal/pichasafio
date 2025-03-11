import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { Resend } from 'resend';
import process from 'process';

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

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

export default function Register() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checkingUsername, setCheckingUsername] = useState<boolean>(false);

  // Validar disponibilidad del nombre de usuario
  useEffect(() => {
    const checkUsername = async () => {
      if (username.length > 0) {
        setCheckingUsername(true);
        setUsernameAvailable(null);
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username)
          .single();

        if (error && error.code !== 'PGRST116') {
          setError('Error al verificar el nombre de usuario');
          setUsernameAvailable(null);
        } else if (data) {
          setUsernameAvailable(false);
        } else {
          setUsernameAvailable(true);
        }
        setCheckingUsername(false);
      }
    };

    const timeout = setTimeout(checkUsername, 500);
    return () => clearTimeout(timeout);
  }, [username]);

  const sendVerificationEmailWithResend = async (userEmail: string, token: string) => {
    try {
      await resend.emails.send({
        from: process.env.REACT_APP_RESEND_FROM_EMAIL || 'noreply@tu-dominio.com',
        to: userEmail,
        subject: 'Verifica tu cuenta',
        html: `<p>Haz clic <a href="${process.env.REACT_APP_SITE_URL}/verify?token=${token}&type=signup">aquí</a> para verificar tu cuenta.</p>`,
      });
      console.log('Correo de verificación enviado con Resend');
    } catch (err) {
      console.error('Error enviando correo con Resend:', err);
      setError('No se pudo enviar el correo de verificación. Intenta de nuevo.');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }
    if (!termsAccepted) {
      setError('Debes aceptar los términos y condiciones');
      setLoading(false);
      return;
    }
    if (usernameAvailable === false || usernameAvailable === null) {
      setError('El nombre de usuario no está disponible o aún se está verificando');
      setLoading(false);
      return;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Por favor, ingresa un correo válido');
      setLoading(false);
      return;
    }

    try {
      const { data: authData, error: authError }: AuthResponse = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
          emailRedirectTo: `${process.env.REACT_APP_SITE_URL}/auth/callback`,
        },
      });

      if (authError) {
        if (authError.message.includes('rate limit exceeded')) {
          // Si Supabase falla por límite, usa Resend
          const { data, error } = await supabase.auth.admin.generateLink('signup', email);
          if (error) throw error;
          await sendVerificationEmailWithResend(email, data.properties.action_link);
          setSuccess(true);
        } else {
          throw authError;
        }
      } else {
        const user = authData.user;
        if (!user) throw new Error('No se pudo registrar el usuario.');

        const { error: profileError }: ProfileResponse = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            username,
            email: user.email,
            created_at: new Date().toISOString(),
          });

        if (profileError) {
          await supabase.auth.admin.deleteUser(user.id);
          throw profileError;
        }

        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Error al registrar. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <p style={styles.verificationMessage}>REVISAR TU CORREO PARA VERIFICAR TU CUENTA</p>
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
          <div style={styles.inputContainer}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nombre de usuario"
              required
              style={styles.input}
            />
            {checkingUsername ? (
              <span style={styles.checking}>Verificando...</span>
            ) : username && usernameAvailable !== null && (
              <span style={usernameAvailable ? styles.available : styles.unavailable}>
                {usernameAvailable ? '✓ Disponible' : '✗ No disponible'}
              </span>
            )}
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            style={styles.input}
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar contraseña"
            required
            style={styles.input}
          />
          <label style={styles.checkboxContainer}>
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              style={styles.checkbox}
            />
            Acepto los términos y condiciones
          </label>
          <button type="submit" disabled={loading || checkingUsername} style={styles.button}>
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
  verificationMessage: {
    color: '#007bff',
    fontWeight: 'bold',
    marginBottom: '15px',
    textAlign: 'center' as 'center',
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
  inputContainer: {
    position: 'relative' as 'relative',
    marginBottom: '15px',
  },
  input: {
    padding: '10px',
    marginBottom: '15px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '16px',
    width: '100%',
  },
  checking: {
    color: '#666',
    position: 'absolute' as 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '14px',
  },
  available: {
    color: 'green',
    position: 'absolute' as 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '14px',
  },
  unavailable: {
    color: 'red',
    position: 'absolute' as 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '14px',
  },
  checkboxContainer: {
    marginBottom: '15px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  checkbox: {
    width: '20px',
    height: '20px',
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
  errorMessage: {
    color: 'red',
    marginTop: '10px',
    textAlign: 'center' as 'center',
  },
  successMessage: {
    color: 'green',
    marginTop: '10px',
    textAlign: 'center' as 'center',
  },
};