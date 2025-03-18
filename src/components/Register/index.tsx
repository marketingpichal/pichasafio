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
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [checkingEmail, setCheckingEmail] = useState<boolean>(false);

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

  // Password validation
  const validatePassword = (pass: string) => {
    const minLength = pass.length >= 8;
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecialChar = /[!@#$%^&*]/.test(pass);
    
    return {
      isValid: minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
      errors: {
        minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumber,
        hasSpecialChar,
      }
    };
  };

  // Email validation effect
  useEffect(() => {
    const checkEmail = async () => {
      if (email.length > 0 && email.includes('@')) {
        setCheckingEmail(true);
        setEmailAvailable(null);
        const { data, error } = await supabase
          .from('profiles')
          .select('email')
          .eq('email', email)
          .single();

        if (error && error.code !== 'PGRST116') {
          setError('Error al verificar el email');
          setEmailAvailable(null);
        } else if (data) {
          setEmailAvailable(false);
        } else {
          setEmailAvailable(true);
        }
        setCheckingEmail(false);
      }
    };

    const timeout = setTimeout(checkEmail, 500);
    return () => clearTimeout(timeout);
  }, [email]);

  const sendVerificationEmailWithResend = async (userEmail: string, token: string) => {
    try {
      await resend.emails.send({
        from: import.meta.env.REACT_APP_RESEND_FROM_EMAIL || 'noreply@tu-dominio.com',
        to: userEmail,
        subject: 'Verifica tu cuenta',
        html: `<p>Haz clic <a href="${import.meta.env.REACT_APP_SITE_URL}/verify?token=${token}&type=signup">aquí</a> para verificar tu cuenta.</p>`,
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
  
    // Enhanced validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }
  
    if (username.length < 3) {
      setError('Username must be at least 3 characters long');
      setLoading(false);
      return;
    }
  
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
      // First, check if email already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('email')
        .eq('email', email)
        .single();

      if (existingUser) {
        setError('This email is already registered');
        setLoading(false);
        return;
      }

      // Proceed with registration
      const { data: authData, error: authError }: AuthResponse = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { 
            username,
          },
          emailRedirectTo: `${import.meta.env.VITE_SITE_URL}/auth/callback`,
        },
      });

      if (authError) {
        throw authError;
      } 
      
      if (authData.user) {
        // Check if profile already exists
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', authData.user.id)
          .single();

        if (!existingProfile) {
          // Only create profile if it doesn't exist
          const { error: profileError }: ProfileResponse = await supabase
            .from('profiles')
            .insert({
              id: authData.user.id,
              username,
              email: authData.user.email,
              created_at: new Date().toISOString(),
              "30_days": []
            });

          if (profileError) {
            // Rollback user creation if profile creation fails
            await supabase.auth.admin.deleteUser(authData.user.id);
            throw profileError;
          }
        }

        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
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
          <div style={styles.inputContainer}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              style={styles.input}
            />
            {checkingEmail ? (
              <span style={styles.checking}>Verificando...</span>
            ) : email && emailAvailable !== null && (
              <span style={emailAvailable ? styles.available : styles.unavailable}>
                {emailAvailable ? '✓ Disponible' : '✗ Email en uso'}
              </span>
            )}
          </div>

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

          <div style={styles.inputContainer}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              style={styles.input}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          {password && (
            <div style={styles.passwordRequirements}>
              <p style={validatePassword(password).errors.minLength ? styles.validRequirement : styles.invalidRequirement}>
                ✓ Mínimo 8 caracteres
              </p>
              <p style={validatePassword(password).errors.hasUpperCase ? styles.validRequirement : styles.invalidRequirement}>
                ✓ Al menos una mayúscula
              </p>
              <p style={validatePassword(password).errors.hasLowerCase ? styles.validRequirement : styles.invalidRequirement}>
                ✓ Al menos una minúscula
              </p>
              <p style={validatePassword(password).errors.hasNumber ? styles.validRequirement : styles.invalidRequirement}>
                ✓ Al menos un número
              </p>
              <p style={validatePassword(password).errors.hasSpecialChar ? styles.validRequirement : styles.invalidRequirement}>
                ✓ Al menos un carácter especial (!@#$%^&*)
              </p>
            </div>
          )}

          <div style={styles.inputContainer}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmar contraseña"
              required
              style={styles.input}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.passwordToggle}
            >
              {showConfirmPassword ? '🙈' : '👁️'}
            </button>
          </div>

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
  passwordToggle: {
    position: 'absolute' as 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '4px',
  },
  passwordRequirements: {
    marginBottom: '15px',
    fontSize: '14px',
  },
  validRequirement: {
    color: 'green',
    margin: '4px 0',
  },
  invalidRequirement: {
    color: '#666',
    margin: '4px 0',
  },
};