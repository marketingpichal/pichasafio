import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useSearchParams } from 'react-router-dom';

export default function DebugResetPassword() {
  const [email, setEmail] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [searchParams] = useSearchParams();

  const testResetPassword = async () => {
    setLoading(true);
    setDebugInfo(null);

    try {
      console.log('=== INICIO DEBUG RESET PASSWORD ===');
      console.log('Email:', email);
      console.log('VITE_SITE_URL:', import.meta.env.VITE_SITE_URL);
      console.log('window.location.origin:', window.location.origin);
      
      const redirectUrl = `${import.meta.env.VITE_SITE_URL}/reset-password`;
      console.log('Redirect URL completa:', redirectUrl);
      
      // Intentar reset password
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      console.log('Respuesta completa de resetPasswordForEmail:', { data, error });
      
      const debugData = {
        success: !error,
        error: error?.message || null,
        environment: {
          VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
          VITE_SITE_URL: import.meta.env.VITE_SITE_URL,
          window_origin: window.location.origin,
          redirect_url: redirectUrl
        },
        supabase_response: { data, error }
      };

      setDebugInfo(debugData);
      
    } catch (err: any) {
      console.error('Error en reset password:', err);
      setDebugInfo({
        success: false,
        error: err.message,
        caught_error: err
      });
    }

    setLoading(false);
  };

  const checkUrlParams = () => {
    const params = Object.fromEntries(searchParams.entries());
    console.log('Parámetros actuales en la URL:', params);
    setDebugInfo({
      url_params: params,
      current_url: window.location.href,
      search_string: window.location.search,
      hash: window.location.hash
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Debug Reset Password</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Probar Reset Password</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email para reset:
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={testResetPassword}
                disabled={loading || !email}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Enviando...' : 'Enviar Reset Password'}
              </button>
              
              <button
                onClick={checkUrlParams}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Verificar Parámetros URL
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Información de Debug</h2>
          
          <div className="bg-gray-900 rounded p-4 overflow-auto">
            <pre className="text-green-400 text-sm whitespace-pre-wrap">
              {debugInfo ? JSON.stringify(debugInfo, null, 2) : 'No hay información de debug aún...'}
            </pre>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-white mb-4">Instrucciones</h2>
          <div className="text-gray-300 space-y-2">
            <p>1. Ingresa un email válido y haz clic en "Enviar Reset Password"</p>
            <p>2. Revisa la consola del navegador para logs detallados</p>
            <p>3. Revisa tu email para el enlace de reset</p>
            <p>4. Cuando hagas clic en el enlace del email, regresa aquí y haz clic en "Verificar Parámetros URL"</p>
            <p>5. Los parámetros deberían incluir access_token, refresh_token, y type=recovery</p>
          </div>
        </div>
      </div>
    </div>
  );
}