import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function ResetPasswordDebug() {
  const [email, setEmail] = useState('');
  const [siteUrl, setSiteUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testResetPassword = async () => {
    setLoading(true);
    setResult(null);

    try {
      const redirectUrl = `${siteUrl}/reset-password`;
      
      console.log('=== TEST RESET PASSWORD ===');
      console.log('Email:', email);
      console.log('Site URL:', siteUrl);
      console.log('Redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });

      const testResult = {
        success: !error,
        error: error?.message || null,
        data,
        environment: {
          VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
          VITE_SITE_URL: import.meta.env.VITE_SITE_URL,
          current_site_url: siteUrl,
          redirect_url: redirectUrl
        },
        instructions: [
          '1. Revisa tu email para el enlace de reset',
          '2. El enlace debería redirigir a: ' + redirectUrl,
          '3. Si el enlace no funciona, verifica la configuración de Vercel',
          '4. Asegúrate de que VITE_SITE_URL esté configurada en Vercel'
        ]
      };

      setResult(testResult);
      console.log('Test result:', testResult);
      
    } catch (err) {
      console.error('Error en test:', err);
      setResult({
        success: false,
        error: err instanceof Error ? err.message : 'Error desconocido',
        environment: {
          VITE_SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL,
          VITE_SITE_URL: import.meta.env.VITE_SITE_URL,
          current_site_url: siteUrl
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Debug Reset Password - Vercel</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Configuración de Prueba</h2>
          
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
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Site URL (Vercel):
              </label>
              <input
                type="url"
                value={siteUrl}
                onChange={(e) => setSiteUrl(e.target.value)}
                placeholder="https://tu-app.vercel.app"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"
              />
              <p className="text-xs text-gray-400 mt-1">
                Usa tu URL de Vercel (ej: https://pichasafio.vercel.app)
              </p>
            </div>
            
            <button
              onClick={testResetPassword}
              disabled={loading || !email || !siteUrl}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Probar Reset Password'}
            </button>
          </div>
        </div>

        {result && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Resultado de la Prueba</h2>
            
            <div className="bg-gray-900 rounded p-4 overflow-auto">
              <pre className="text-green-400 text-sm whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-lg p-6 mt-6">
          <h2 className="text-xl font-semibold text-white mb-4">Configuración de Vercel</h2>
          
          <div className="space-y-4 text-gray-300">
            <div>
              <h3 className="font-semibold text-white">1. Variables de Entorno en Vercel:</h3>
              <p className="text-sm">Ve a tu dashboard de Vercel → Settings → Environment Variables</p>
              <ul className="text-sm list-disc list-inside ml-4 mt-2">
                <li><code className="bg-gray-700 px-1 rounded">VITE_SUPABASE_URL</code> = tu URL de Supabase</li>
                <li><code className="bg-gray-700 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> = tu clave anónima de Supabase</li>
                <li><code className="bg-gray-700 px-1 rounded">VITE_SITE_URL</code> = https://tu-app.vercel.app</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white">2. Archivo vercel.json:</h3>
              <p className="text-sm">Ya está configurado correctamente para manejar las rutas del SPA.</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white">3. Configuración de Supabase:</h3>
              <p className="text-sm">Ve a tu dashboard de Supabase → Authentication → URL Configuration</p>
              <ul className="text-sm list-disc list-inside ml-4 mt-2">
                <li>Site URL: <code className="bg-gray-700 px-1 rounded">https://tu-app.vercel.app</code></li>
                <li>Redirect URLs: <code className="bg-gray-700 px-1 rounded">https://tu-app.vercel.app/reset-password</code></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
