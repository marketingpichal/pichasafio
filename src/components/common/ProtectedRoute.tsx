import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
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
  redirectTo = '/login' 
}) => {
  const { user } = useAuth();
  const location = useLocation();

  // Si no hay usuario autenticado, mostrar página de acceso restringido
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <ResponsiveCard className="max-w-2xl mx-auto">
              <div className="space-y-6">
                {/* Icono de bloqueo */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                    <Lock className="w-10 h-10 text-white" />
                  </div>
                </div>

                {/* Título */}
                <h1 className="text-3xl sm:text-4xl font-bold gradient-text-extended mb-4">
                  Acceso Restringido
                </h1>

                {/* Descripción */}
                <p className="text-gray-300 text-lg leading-relaxed mb-6">
                  Esta sección es exclusiva para miembros registrados. 
                  Inicia sesión o regístrate para acceder a todo el contenido premium.
                </p>

                {/* Beneficios */}
                <div className="bg-gray-800/50 rounded-xl p-6 mb-6">
                  <h3 className="text-xl font-semibold text-white mb-4">¿Qué obtienes al registrarte?</h3>
                  <ul className="text-gray-300 space-y-2 text-left">
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Acceso completo a todas las poses y ejercicios</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Participación en la comunidad y comentarios</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Reto de 30 días con seguimiento personalizado</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Progreso guardado y estadísticas personales</span>
                    </li>
                  </ul>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <ResponsiveButton
                    onClick={() => window.location.href = '/login'}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    Iniciar Sesión
                  </ResponsiveButton>
                  
                  <ResponsiveButton
                    onClick={() => window.location.href = '/register'}
                    variant="ghost"
                    className="border border-gray-600 text-gray-300 hover:border-blue-400 hover:text-white"
                  >
                    <UserPlus className="w-5 h-5 mr-2" />
                    Registrarse Gratis
                  </ResponsiveButton>
                </div>

                {/* Nota adicional */}
                <p className="text-gray-400 text-sm">
                  El registro es completamente gratuito y solo toma unos segundos.
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