import { createClient } from '@supabase/supabase-js';
import { config } from './config';

// Cliente de Supabase configurado según el entorno
export const supabase = createClient(
  config.supabase.url,
  config.supabase.anonKey,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    },
    global: {
      headers: {
        'X-Client-Info': `${config.app.name}@${config.app.version}`,
      },
    },
  }
);