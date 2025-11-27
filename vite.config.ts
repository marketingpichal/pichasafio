import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Cargar variables de entorno según el modo
  
  // Determinar el puerto según el entorno
  const getPort = () => {
    if (mode === 'development') return 5173;
    if (mode === 'production') return 3000;
    return 3000;
  };
  
  console.log(`🚀 Configurando Vite en modo: ${mode}`);
  console.log(`🌐 Puerto: ${getPort()}`);
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: getPort(),
      host: true,
      open: false,
    },
    preview: {
      port: getPort(),
      host: true,
    },
    build: {
      outDir: mode === 'development' ? 'dist-dev' : 'dist',
      sourcemap: mode === 'development',
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
    define: {
      __APP_ENV__: JSON.stringify(mode),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    envDir: './',
    envPrefix: ['VITE_', 'SUPABASE_'],
  };
});
