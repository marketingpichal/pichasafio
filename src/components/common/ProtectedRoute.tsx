import React from 'react';

import { useAuth } from '../../context/AuthProvider';
import { motion } from 'framer-motion';
import { Lock, LogIn, UserPlus } from 'lucide-react';
import ResponsiveCard from './ResponsiveCard';
import ResponsiveButton from './ResponsiveButton';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
}) => {
  const { user } = useAuth();

  // Si no hay usuario autenticado, mostrar página de acceso restringido
  if (!user) {
    return (
      <div className="min-h-screen bg-stone-950 py-8 sm:py-12 flex items-center justify-center">
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <ResponsiveCard className="max-w-2xl mx-auto bg-stone-900 border-stone-800 shadow-2xl shadow-black/80">
              <div className="space-y-6">
                {/* Icono de bloqueo */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-red-600/10 border-2 border-red-500/30 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                    <Lock className="w-10 h-10 text-red-500" />
                  </div>
                </div>

                {/* Título */}
                <h1 className="text-2xl sm:text-4xl font-poppins-bold uppercase tracking-wider text-white mb-4">
                  Acceso Restringido
                </h1>

                {/* Descripción */}
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Esta sección es exclusiva para miembros registrados.
                  Inicia sesión o regístrate para acceder a todo el contenido premium.
                </p>

                {/* Beneficios */}
                <div className="bg-stone-950 border border-stone-800 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-poppins-bold tracking-wide text-white mb-4 uppercase">¿Qué obtienes al registrarte?</h3>
                  <ul className="text-gray-300 space-y-3 text-left">
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                      <span>Acceso completo a todas las poses y ejercicios</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                      <span>Participación en la comunidad y comentarios</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                      <span>Reto de 30 días con seguimiento personalizado</span>
                    </li>
                    <li className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-red-500 rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]"></div>
                      <span>Progreso guardado y estadísticas personales</span>
                    </li>
                  </ul>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <ResponsiveButton
                    onClick={() => window.location.href = '/login'}
                    variant="primary"
                    className="flex items-center justify-center font-poppins-bold uppercase tracking-wider"
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    Iniciar Sesión
                  </ResponsiveButton>

                  <ResponsiveButton
                    onClick={() => window.location.href = '/register'}
                    variant="ghost"
                    className="border border-stone-700 bg-stone-900 text-gray-300 hover:border-red-500 hover:text-white flex items-center justify-center font-poppins-bold uppercase tracking-wider"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Registrarse Gratis
                  </ResponsiveButton>
                </div>

                {/* Nota adicional */}
                <p className="text-gray-500 text-xs uppercase tracking-widest mt-4">
                  El registro es gratuito y no toma más de un minuto.
                </p>
              </div>
            </ResponsiveCard>
          </motion.div>
        </div>
      </div>
    );
  }

  // Si el usuario está autenticado, mostrar el contenido protegido
  return <>{children}</>;
};

export default ProtectedRoute;