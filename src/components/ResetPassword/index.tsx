import { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import ResponsiveCard from "../common/ResponsiveCard";
import ResponsiveButton from "../common/ResponsiveButton";

export default function ResetPassword() {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [isValidRecoveryLink, setIsValidRecoveryLink] = useState<boolean>(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const recoveryTokensRef = useRef<{accessToken: string, refreshToken: string} | null>(null);

  useEffect(() => {
    // Debug: mostrar todos los parámetros de la URL
    console.log('=== DEBUG RESET PASSWORD ===');
    console.log('URL completa:', window.location.href);
    console.log('Search params:', Object.fromEntries(searchParams.entries()));
    
    // Verificar si hay tokens de recuperación en la URL
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    const type = searchParams.get('type');
    
    console.log('Access token:', accessToken ? 'Presente' : 'No encontrado');
    console.log('Refresh token:', refreshToken ? 'Presente' : 'No encontrado');
    console.log('Type:', type);
    
    if (accessToken && refreshToken && type === 'recovery') {
      console.log('Enlace de recuperación válido detectado');
      // Guardar los tokens para usarlos más tarde, pero NO establecer la sesión aquí
      recoveryTokensRef.current = { accessToken, refreshToken };
      setIsValidRecoveryLink(true);
    } else {
      console.log('No se encontraron tokens válidos de recuperación en la URL');
      setIsValidRecoveryLink(false);
      if (!accessToken || !refreshToken) {
        setError('Enlace de recuperación inválido. Los tokens de acceso no están presentes.');
      } else if (type !== 'recovery') {
        setError('Enlace de recuperación inválido. Tipo de operación incorrecto.');
      }
    }
  }, [searchParams]);

  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validaciones
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    if (!recoveryTokensRef.current) {
      setError("No se encontraron tokens de recuperación válidos.");
      setLoading(false);
      return;
    }

    try {
      console.log('Estableciendo sesión temporal para reset de contraseña...');
      
      // Establecer la sesión temporalmente solo para el reset
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: recoveryTokensRef.current.accessToken,
        refresh_token: recoveryTokensRef.current.refreshToken,
      });

      if (sessionError) {
        console.error('Error al establecer sesión temporal:', sessionError);
        setError(`Error al establecer sesión: ${sessionError.message}`);
        setLoading(false);
        return;
      }

      console.log('Sesión temporal establecida, actualizando contraseña...');

      // Ahora actualizar la contraseña
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) {
        console.error('Error al actualizar contraseña:', updateError);
        setError(`Error al actualizar contraseña: ${updateError.message}`);
      } else {
        console.log('Contraseña actualizada exitosamente');
        setSuccess(true);
        
        // Cerrar la sesión temporal después del reset
        await supabase.auth.signOut();
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err: unknown) {
      console.error('Error inesperado:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error inesperado: ${errorMessage}`);
    }

    setLoading(false);
  };

  // Si no es un enlace de recuperación válido, mostrar error
  if (!isValidRecoveryLink && !success) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <ResponsiveCard
            title="Enlace Inválido"
            subtitle="Este enlace de recuperación no es válido"
            className="text-center"
          >
            <div className="space-y-4">
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
                onClick={() => navigate('/login')}
                className="w-full"
                size="lg"
              >
                Volver al Inicio de Sesión
              </ResponsiveButton>
            </div>
          </ResponsiveCard>
        </motion.div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <ResponsiveCard
            title="¡Contraseña Actualizada!"
            subtitle="Tu contraseña ha sido cambiada exitosamente"
            className="text-center"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-green-500/10 border border-green-500/20 rounded-xl p-4"
              >
                <p className="text-green-400 text-sm">
                  Serás redirigido al inicio de sesión en unos segundos...
                </p>
              </motion.div>
              
              <ResponsiveButton
                onClick={() => navigate('/login')}
                className="w-full"
                size="lg"
              >
                Ir al Inicio de Sesión
              </ResponsiveButton>
            </div>
          </ResponsiveCard>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <ResponsiveCard
          title="Nueva Contraseña"
          subtitle="Ingresa tu nueva contraseña"
          className="text-center"
        >
          <form onSubmit={handlePasswordReset} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 text-left">
                Nueva Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
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

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 text-left">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu nueva contraseña"
                  required
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
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
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Actualizando...</span>
                </div>
              ) : (
                "Actualizar Contraseña"
              )}
            </ResponsiveButton>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium text-sm"
              >
                Volver al inicio de sesión
              </button>
            </div>
          </form>
        </ResponsiveCard>
      </motion.div>
    </div>
  );
}