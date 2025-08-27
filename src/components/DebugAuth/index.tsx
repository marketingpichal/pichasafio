import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function DebugAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testSignUp = async () => {
    setLoading(true);
    setDebugInfo(null);

    try {
      console.log('=== INICIO DEBUG REGISTRO ===');
      console.log('Email:', email);
      console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
      console.log('VITE_SITE_URL:', import.meta.env.VITE_SITE_URL);
      
      // Verificar configuración de Supabase
      const { data: config } = await supabase.auth.getSession();
      console.log('Sesión actual:', config);

      // Intentar registro
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${import.meta.env.VITE_SITE_URL}/auth/callback`,
        },
      });

      console.log('Respuesta completa de signUp:', { data, error });
      
      const debugData = {
        success: !error,
        error: error?.message || null,
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
          email_confirmed_at: data.user.email_confirmed_at,
          confirmed_at: data.user.confirmed_at,
          identities: data.user.identities?.length || 0
        } : null,
        session: data.session ? 'Sesión creada' : 'Sin sesión',
        environment: {
          VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
          VITE_SITE_URL: import.meta.env.VITE_SITE_URL,
        }
      };

      setDebugInfo(debugData);

      // Si el usuario fue creado pero no hay identidades, significa que ya existe
      if (data.user && (!data.user.identities || data.user.identities.length === 0)) {
        console.log('Usuario ya existe, intentando reenviar confirmación...');
        
        const { data: resendData, error: resendError } = await supabase.auth.resend({
          email,
          type: 'signup'
        });
        
        console.log('Resultado de reenvío:', { resendData, resendError });
        
        setDebugInfo((prev: any) => ({
          ...prev,
          resend: {
            success: !resendError,
            error: resendError?.message || null
          }
        }));
      }

    } catch (err: any) {
      console.error('Error en debug:', err);
      setDebugInfo({
        success: false,
        error: err.message,
        stack: err.stack
      });
    } finally {
      setLoading(false);
    }
  };

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Usuario actual:', user);
    
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      console.log('Perfil del usuario:', profile);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Debug Autenticación</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email de prueba:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="test@example.com"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contraseña:
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password123!"
          />
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={testSignUp}
          disabled={loading || !email || !password}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Probando...' : 'Probar Registro'}
        </button>
        
        <button
          onClick={checkUser}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Verificar Usuario Actual
        </button>
      </div>

      {debugInfo && (
        <div className="bg-gray-100 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Información de Debug:</h3>
          <pre className="text-sm overflow-auto">
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <h4 className="font-semibold text-yellow-800 mb-2">Posibles causas de problemas:</h4>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Confirmación de email deshabilitada en Supabase</li>
          <li>• URL de sitio incorrecta en configuración</li>
          <li>• Límite de emails alcanzado (4 por hora en plan gratuito)</li>
          <li>• Emails van a spam o carpeta de promociones</li>
          <li>• Usuario ya existe pero no confirmado</li>
        </ul>
      </div>
    </div>
  );
}