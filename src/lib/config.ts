// Configuración de entorno para desarrollo y producción

interface Config {
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey?: string;
  };
  app: {
    name: string;
    version: string;
    url: string;
    env: string;
  };
  auth: {
    redirectUrl: string;
    resetPasswordUrl: string;
  };
}

// Detectar el entorno actual
const getEnvironment = (): 'development' | 'production' => {
  // Verificar si estamos en modo desarrollo
  if (import.meta.env.DEV || import.meta.env.VITE_APP_ENV === 'development') {
    return 'development';
  }
  return 'production';
};

const environment = getEnvironment();

// Configuración por entorno
const config: Config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || '',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || '',
    serviceRoleKey: import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Pichasafio',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    url: import.meta.env.VITE_APP_URL || 'http://localhost:3001',
    env: environment,
  },
  auth: {
    redirectUrl: import.meta.env.VITE_AUTH_REDIRECT_URL || 'http://localhost:3001/auth/callback',
    resetPasswordUrl: import.meta.env.VITE_AUTH_RESET_PASSWORD_URL || 'http://localhost:3001/reset-password',
  },
};

// Validar configuración requerida
if (!config.supabase.url || !config.supabase.anonKey) {
  throw new Error(
    `Configuración de Supabase incompleta para el entorno ${environment}. ` +
    'Verifica que VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY estén definidas.'
  );
}

// Log del entorno actual (solo en desarrollo)
if (environment === 'development') {
  console.log(`🚀 Aplicación iniciada en modo ${environment}`);
  console.log(`📊 Base de datos: ${config.supabase.url}`);
  console.log(`🌐 URL de la app: ${config.app.url}`);
}

export { config, environment };
export type { Config };