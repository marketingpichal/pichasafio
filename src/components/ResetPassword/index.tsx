import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
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
  const [isValidToken, setIsValidToken] = useState<boolean>(false);
  const [isCheckingToken, setIsCheckingToken] = useState<boolean>(true);
  const [debugInfo, setDebugInfo] = useState<string>('');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    checkResetToken();
    
    // Escuchar cambios en el hash de la URL
    const handleHashChange = () => {
      console.log('Hash cambiado, verificando token nuevamente...');
      setIsCheckingToken(true);
      checkResetToken();
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const checkResetToken = async () => {
    try {
      // Extraer el token del hash de la URL
      const hash = window.location.hash;
      const urlParams = new URLSearchParams(hash.substring(1)); // Remover el # inicial
      
      const accessToken = urlParams.get('access_token');
      const refreshToken = urlParams.get('refresh_token');
      const tokenType = urlParams.get('type');
      
      console.log('Hash de la URL:', hash);
      console.log('Access Token:', accessToken ? 'Presente' : 'No presente');
      console.log('Refresh Token:', refreshToken ? 'Presente' : 'No presente');
      console.log('Token Type:', tokenType);
      
      // Información de debug para desarrollo
      setDebugInfo(`Hash: ${hash.substring(0, 50)}... | Token: ${accessToken ? 'Presente' : 'No presente'} | Type: ${tokenType}`);
      
      if (accessToken && tokenType === 'recovery') {
        // Si tenemos un token de recuperación válido, establecer la sesión
        const { data, error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || ''
        });
        
        if (error) {
          console.error('Error al establecer sesión:', error);
          setError('Error al procesar el enlace de recuperación. Por favor, solicita un nuevo enlace.');
          setIsValidToken(false);
        } else if (data.session) {
          console.log('Sesión establecida correctamente');
          setIsValidToken(true);
        } else {
          setError('El enlace de recuperación no es válido o ha expirado. Por favor, solicita un nuevo enlace.');
          setIsValidToken(false);
        }
      } else {
        // Si no hay token en el hash, verificar si ya hay una sesión válida
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error al verificar sesión:', error);
          setError('Error al verificar el enlace de recuperación. Por favor, solicita un nuevo enlace.');
          setIsValidToken(false);
        } else if (session) {
          console.log('Sesión existente válida');
          setIsValidToken(true);
        } else {
          setError('El enlace de recuperación no es válido o ha expirado. Por favor, solicita un nuevo enlace.');
          setIsValidToken(false);
        }
      }
    } catch (err) {
      console.error('Error inesperado al verificar token:', err);
      setError('Error inesperado al verificar el enlace. Por favor, intenta nuevamente.');
      setIsValidToken(false);
    } finally {
      setIsCheckingToken(false);
    }
  };

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

    try {
      // Actualizar la contraseña del usuario
      const { error } = await supabase.auth.updateUser({
        password: password
      });

      if (error) {
        console.error('Error al actualizar contraseña:', error);
        setError(`Error al actualizar la contraseña: ${error.message}`);
      } else {
        console.log('Contraseña actualizada exitosamente');
        setSuccess(true);
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err: unknown) {
      console.error('Error inesperado:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(`Error inesperado: ${errorMessage}`);
    }

    setLoading(false);
  };

  const handleRequestNewLink = () => {
    navigate("/login");
  };

  const simulateTokenFromUrl = () => {
    // Simular el token que viene en la URL del email
    const mockHash = '#access_token=mock_token&refresh_token=mock_refresh&type=recovery';
    window.location.hash = mockHash;
    console.log('Simulando token de URL:', mockHash);
  };

  if (isCheckingToken) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <ResponsiveCard
            title="Verificando enlace..."
            subtitle="Estamos validando tu enlace de recuperación"
            className="text-center"
          >
            <div className="flex items-center justify-center py-8">
              <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            
            {debugInfo && (
              <div className="bg-gray-800 rounded-lg p-3 mt-4">
                <p className="text-xs text-gray-400">Debug: {debugInfo}</p>
              </div>
            )}
          </ResponsiveCard>
        </motion.div>
      </div>
    );
  }

  if (!isValidToken) {
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
            subtitle="El enlace de recuperación no es válido o ha expirado"
            className="text-center"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <AlertCircle className="w-16 h-16 text-red-500" />
              </div>
              
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-red-400 text-sm">{error}</p>
                <p className="text-gray-400 text-xs mt-2">
                  Si el problema persiste, verifica que estés usando el enlace completo del email.
                </p>
                {debugInfo && (
                  <div className="bg-gray-800 rounded p-2 mt-3">
                    <p className="text-xs text-gray-400">Debug: {debugInfo}</p>
                  </div>
                )}
              </div>

              <ResponsiveButton
                onClick={handleRequestNewLink}
                className="w-full"
                size="lg"
              >
                Solicitar Nuevo Enlace
              </ResponsiveButton>
              
              {/* Botón de debug solo en desarrollo */}
              {import.meta.env.DEV && (
                <button
                  onClick={simulateTokenFromUrl}
                  className="w-full px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 text-sm"
                >
                  [DEBUG] Simular Token
                </button>
              )}
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
            subtitle="Tu contraseña ha sido restablecida exitosamente"
            className="text-center"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-center">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
              
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <p className="text-green-400 text-sm">
                  Tu contraseña ha sido actualizada correctamente. Serás redirigido al inicio de sesión en unos segundos.
                </p>
              </div>

              <ResponsiveButton
                onClick={() => navigate("/login")}
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
          title="Restablecer Contraseña"
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
                  placeholder="Tu nueva contraseña"
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
              <p className="text-xs text-gray-400">Mínimo 6 caracteres</p>
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
                  placeholder="Confirma tu nueva contraseña"
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
                onClick={() => navigate("/login")}
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
