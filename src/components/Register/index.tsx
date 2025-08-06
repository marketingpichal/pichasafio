import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { motion } from "framer-motion";
import ResponsiveCard from "../common/ResponsiveCard";
import ResponsiveButton from "../common/ResponsiveButton";
import { Eye, EyeOff, Check, X } from "lucide-react";

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
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [username, setUsername] = useState<string>("");
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
          .from("profiles")
          .select("username")
          .eq("username", username)
          .single();

        if (error && error.code !== "PGRST116") {
          setError("Error al verificar el nombre de usuario");
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
      },
    };
  };

  // Email validation effect
  useEffect(() => {
    const checkEmail = async () => {
      if (email.length > 0 && email.includes("@")) {
        setCheckingEmail(true);
        setEmailAvailable(null);
        const { data, error } = await supabase
          .from("profiles")
          .select("email")
          .eq("email", email)
          .single();

        if (error && error.code !== "PGRST116") {
          setError("Error al verificar el email");
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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Enhanced validation
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    if (username.length < 3) {
      setError("El nombre de usuario debe tener al menos 3 caracteres");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }
    
    if (!termsAccepted) {
      setError("Debes aceptar los términos y condiciones");
      setLoading(false);
      return;
    }
    
    if (usernameAvailable === false || usernameAvailable === null) {
      setError("El nombre de usuario no está disponible o aún se está verificando");
      setLoading(false);
      return;
    }
    
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError("Por favor, ingresa un correo válido");
      setLoading(false);
      return;
    }

    try {
      // First, check if email already exists
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", email)
        .single();

      if (existingUser) {
        setError("Este email ya está registrado");
        setLoading(false);
        return;
      }

      // Proceed with registration
      const { data: authData, error: authError }: AuthResponse =
        await supabase.auth.signUp({
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
          .from("profiles")
          .select("id")
          .eq("id", authData.user.id)
          .single();

        if (!existingProfile) {
          // Only create profile if it doesn't exist
          const { error: profileError }: ProfileResponse = await supabase
            .from("profiles")
            .insert({
              id: authData.user.id,
              username,
              email: authData.user.email,
              created_at: new Date().toISOString(),
              "30_days": [],
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
      setError(err.message || "Error en el registro. Por favor, intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <ResponsiveCard
          title="Crear Cuenta"
          subtitle="Únete a nuestra comunidad"
          className="text-center"
        >
          <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
            <p className="text-blue-400 text-sm font-medium">
              REVISAR TU CORREO PARA VERIFICAR TU CUENTA
            </p>
          </div>

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-500/10 border border-green-500/20 rounded-xl p-6 text-center"
            >
              <Check className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-400 mb-2">
                ¡Registro Exitoso!
              </h3>
              <p className="text-green-300 text-sm">
                Por favor, revisa tu correo para confirmar tu cuenta.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 text-left">
                  Email
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    disabled={loading}
                  />
                  {checkingEmail && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  {email && emailAvailable !== null && !checkingEmail && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {emailAvailable ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <X className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  )}
                </div>
                {email && emailAvailable !== null && !checkingEmail && (
                  <p className={`text-xs ${emailAvailable ? 'text-green-400' : 'text-red-400'}`}>
                    {emailAvailable ? "✓ Email disponible" : "✗ Email en uso"}
                  </p>
                )}
              </div>

              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 text-left">
                  Nombre de usuario
                </label>
                <div className="relative">
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Tu nombre de usuario"
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    disabled={loading}
                  />
                  {checkingUsername && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                  {username && usernameAvailable !== null && !checkingUsername && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {usernameAvailable ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : (
                        <X className="w-5 h-5 text-red-400" />
                      )}
                    </div>
                  )}
                </div>
                {username && usernameAvailable !== null && !checkingUsername && (
                  <p className={`text-xs ${usernameAvailable ? 'text-green-400' : 'text-red-400'}`}>
                    {usernameAvailable ? "✓ Usuario disponible" : "✗ Usuario no disponible"}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 text-left">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tu contraseña"
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Password Requirements */}
              {password && (
                <div className="bg-gray-800/50 rounded-xl p-4 space-y-2">
                  <p className="text-sm font-medium text-gray-300 mb-3">Requisitos de contraseña:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div className={`flex items-center space-x-2 ${validatePassword(password).errors.minLength ? 'text-green-400' : 'text-gray-500'}`}>
                      <Check className="w-4 h-4" />
                      <span>Mínimo 8 caracteres</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${validatePassword(password).errors.hasUpperCase ? 'text-green-400' : 'text-gray-500'}`}>
                      <Check className="w-4 h-4" />
                      <span>Al menos una mayúscula</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${validatePassword(password).errors.hasLowerCase ? 'text-green-400' : 'text-gray-500'}`}>
                      <Check className="w-4 h-4" />
                      <span>Al menos una minúscula</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${validatePassword(password).errors.hasNumber ? 'text-green-400' : 'text-gray-500'}`}>
                      <Check className="w-4 h-4" />
                      <span>Al menos un número</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${validatePassword(password).errors.hasSpecialChar ? 'text-green-400' : 'text-gray-500'}`}>
                      <Check className="w-4 h-4" />
                      <span>Carácter especial (!@#$%^&*)</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 text-left">
                  Confirmar contraseña
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirma tu contraseña"
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-red-400 text-xs">Las contraseñas no coinciden</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start space-x-3">
                <input
                  id="terms"
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-1 w-5 h-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                />
                <label htmlFor="terms" className="text-sm text-gray-300">
                  Acepto los{" "}
                  <button type="button" className="text-blue-400 hover:text-blue-300 underline">
                    términos y condiciones
                  </button>
                </label>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-xl p-4"
                >
                  <p className="text-red-400 text-sm">{error}</p>
                </motion.div>
              )}

              <ResponsiveButton
                type="submit"
                disabled={loading || checkingUsername}
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Registrando...</span>
                  </div>
                ) : (
                  "Crear Cuenta"
                )}
              </ResponsiveButton>

              <div className="text-center">
                <p className="text-gray-400 text-sm">
                  ¿Ya tienes cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => window.location.href = "/login"}
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
                  >
                    Inicia sesión aquí
                  </button>
                </p>
              </div>
            </form>
          )}
        </ResponsiveCard>
      </motion.div>
    </div>
  );
}
