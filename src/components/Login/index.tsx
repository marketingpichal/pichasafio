import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import ResponsiveCard from "../common/ResponsiveCard";
import ResponsiveButton from "../common/ResponsiveButton";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [resetMode, setResetMode] = useState<boolean>(false);
  const [resetSuccess, setResetSuccess] = useState<boolean>(false);
  const navigate = useNavigate();

  interface SupabaseAuthResponse {
    data: {
      user: {
        id: string;
        email?: string;
      } | null;
    };
    error: {
      message: string;
    } | null;
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const { data, error }: SupabaseAuthResponse =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Verificar si el usuario tiene un perfil con username
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", data.user.id)
        .single();

      if (profileError || !profile || !profile.username) {
        // Si no tiene perfil o no tiene username, redirigir a completar perfil
        setError("Debes completar tu nombre de usuario para continuar.");
        setLoading(false);
        navigate("/complete-profile");
        return;
      }

      console.log("Usuario logueado:", data.user);
      navigate("/rutinas");
    }
    
    setLoading(false);
  };

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email) {
      setError("Por favor, ingresa tu email para recuperar la contraseña.");
      setLoading(false);
      return;
    }

    // Verificar que la variable de entorno esté definida
    const siteUrl = import.meta.env.VITE_SITE_URL;
    if (!siteUrl) {
      setError("Error de configuración: VITE_SITE_URL no está definida. Contacta al administrador.");
      setLoading(false);
      return;
    }

    console.log('Enviando reset password para:', email);
    console.log('Site URL:', siteUrl);
    console.log('Redirect URL:', `${siteUrl}/reset-password`);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/reset-password`,
      });

      if (error) {
        console.error('Error en reset password:', error);
        setError(`Error al enviar el email: ${error.message}`);
      } else {
        console.log('Email de reset enviado exitosamente');
        setResetSuccess(true);
      }
    } catch (err: unknown) {
      console.error('Error inesperado:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error inesperado: ${errorMessage}`);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <ResponsiveCard
          title={resetMode ? "Recuperar Contraseña" : "Iniciar Sesión"}
          subtitle={resetMode ? "Te enviaremos un enlace para restablecer tu contraseña" : "Accede a tu cuenta para continuar"}
          className="text-center"
        >
          <form onSubmit={resetMode ? handlePasswordReset : handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 text-left">
                Email
              </label>
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
            </div>

            {!resetMode && (
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
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-red-500/10 border border-red-500/20 rounded-xl p-4"
              >
                <p className="text-red-400 text-sm">{error}</p>
              </motion.div>
            )}

            {resetSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/10 border border-green-500/20 rounded-xl p-4"
              >
                <p className="text-green-400 text-sm">
                  ¡Correo enviado! Revisa tu bandeja de entrada para restablecer tu contraseña.
                </p>
              </motion.div>
            )}

            <ResponsiveButton
              type="submit"
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Cargando...</span>
                </div>
              ) : resetMode ? (
                "Enviar Enlace de Recuperación"
              ) : (
                "Iniciar Sesión"
              )}
            </ResponsiveButton>

            <div className="text-center space-y-3">
              {!resetMode && (
                <button
                  type="button"
                  onClick={() => {
                    setResetMode(true);
                    setError(null);
                    setResetSuccess(false);
                  }}
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium text-sm"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              )}
              
              {resetMode && (
                <button
                  type="button"
                  onClick={() => {
                    setResetMode(false);
                    setError(null);
                    setResetSuccess(false);
                  }}
                  className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium text-sm"
                >
                  Volver al inicio de sesión
                </button>
              )}
              
              {!resetMode && (
                <p className="text-gray-400 text-sm">
                  ¿No tienes cuenta?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
                  >
                    Regístrate aquí
                  </button>
                </p>
              )}
            </div>
          </form>
        </ResponsiveCard>
      </motion.div>
    </div>
  );
}
