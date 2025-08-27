import { useState, useEffect } from 'react';

interface ConfigStatus {
  supabaseUrl: boolean;
  supabaseKey: boolean;
  siteUrl: boolean;
  allValid: boolean;
}

export default function ConfigChecker() {
  const [configStatus, setConfigStatus] = useState<ConfigStatus>({
    supabaseUrl: false,
    supabaseKey: false,
    siteUrl: false,
    allValid: false
  });

  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    const siteUrl = import.meta.env.VITE_SITE_URL;

    const status: ConfigStatus = {
      supabaseUrl: !!supabaseUrl && supabaseUrl.length > 0,
      supabaseKey: !!supabaseKey && supabaseKey.length > 0,
      siteUrl: !!siteUrl && siteUrl.length > 0,
      allValid: false
    };

    status.allValid = status.supabaseUrl && status.supabaseKey && status.siteUrl;
    setConfigStatus(status);
  }, []);

  if (configStatus.allValid) {
    return null; // No mostrar nada si todo está bien
  }

  return (
    <div className="fixed top-4 right-4 bg-red-600 text-white p-4 rounded-lg shadow-lg z-50 max-w-sm">
      <h3 className="font-bold mb-2">⚠️ Error de Configuración</h3>
      <div className="text-sm space-y-1">
        {!configStatus.supabaseUrl && (
          <p>❌ VITE_SUPABASE_URL no está definida</p>
        )}
        {!configStatus.supabaseKey && (
          <p>❌ VITE_SUPABASE_ANON_KEY no está definida</p>
        )}
        {!configStatus.siteUrl && (
          <p>❌ VITE_SITE_URL no está definida</p>
        )}
      </div>
      <p className="text-xs mt-2 opacity-75">
        Crea un archivo .env en la raíz del proyecto con estas variables.
      </p>
    </div>
  );
}
