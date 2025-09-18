import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/AuthProvider";
import { Lock, User, LogOut, ChevronDown } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

// Componente para enlaces protegidos
const ProtectedLink = ({ to, children, className, onClick, isAuthenticated, showTooltip = true }: {
  to: string;
  children: React.ReactNode;
  className: string;
  onClick: () => void;
  isAuthenticated: boolean;
  showTooltip?: boolean;
}) => {
  if (!isAuthenticated) {
    return (
      <div className={`${className} cursor-not-allowed opacity-60 ${showTooltip ? 'relative group' : ''}`}>
        <div className="flex items-center space-x-2">
          <Lock className="w-4 h-4" />
          <span>{children}</span>
        </div>
        {showTooltip && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
            🔒 Inicia sesión para acceder
          </div>
        )}
      </div>
    );
  }
  
  return (
    <Link to={to} className={className} onClick={onClick}>
      {children}
    </Link>
  );
};



export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExercisesOpen, setIsExercisesOpen] = useState(false);
  const { user } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsExercisesOpen(false);
  };

  const toggleExercises = () => {
    setIsExercisesOpen(!isExercisesOpen);
  };

  const handleLogout = async () => {
    try {
      console.log('🚪 Iniciando logout...');
      
      // Cerrar menú inmediatamente para feedback visual
      closeMenu();
      
      // Ejecutar signOut
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('❌ Error en logout:', error);
        // Mostrar error al usuario si es necesario
        alert('Error al cerrar sesión. Por favor, intenta de nuevo.');
        return;
      }
      
      console.log('✅ Logout exitoso');
      
      // Limpiar cualquier estado local si es necesario
      localStorage.removeItem('supabase.auth.token');
      sessionStorage.clear();
      
      // Redirección explícita a la página principal
      window.location.href = '/';
      
    } catch (error) {
      console.error('❌ Error inesperado en logout:', error);
      alert('Error inesperado al cerrar sesión. Por favor, recarga la página.');
    }
  };

  const isAuthenticated = !!user;

  return (
    <nav className="bg-gray-800 shadow-lg sticky top-0 z-[10000] border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="text-white text-xl font-bold hover:text-blue-400 transition-colors duration-300"
              onClick={closeMenu}
            >
              Pichasafio
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link
                to="/"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                onClick={closeMenu}
              >
                Inicio
              </Link>

              
              {/* Dropdown de Ejercicios */}
               <div className="relative group">
                 {!isAuthenticated ? (
                   <div className="relative">
                     <div className="text-gray-300 px-3 py-2 rounded-md text-sm font-medium flex items-center space-x-1 cursor-not-allowed opacity-60">
                       <Lock className="w-4 h-4" />
                       <span>Ejercicios</span>
                       <ChevronDown className="w-4 h-4" />
                     </div>
                     <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-50">
                       🔒 Inicia sesión para acceder
                     </div>
                   </div>
                 ) : (
                   <>
                     <button
                       className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 flex items-center space-x-1"
                       onMouseEnter={() => setIsExercisesOpen(true)}
                       onMouseLeave={() => setIsExercisesOpen(false)}
                     >
                       <span>Ejercicios</span>
                       <ChevronDown className="w-4 h-4" />
                     </button>
                     
                     <div 
                       className={`absolute top-full left-0 mt-1 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 transition-all duration-200 z-50 ${
                         isExercisesOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                       }`}
                       onMouseEnter={() => setIsExercisesOpen(true)}
                       onMouseLeave={() => setIsExercisesOpen(false)}
                     >
                       <div className="py-1">
                         <ProtectedLink
                           to="/keguel"
                           className="text-gray-300 hover:text-white hover:bg-gray-700 block px-4 py-2 text-sm transition-colors duration-300"
                           onClick={closeMenu}
                           isAuthenticated={isAuthenticated}
                           showTooltip={false}
                         >
                           Reto Keguel
                         </ProtectedLink>
                         <ProtectedLink
                           to="/chochasafio"
                           className="text-gray-300 hover:text-white hover:bg-gray-700 block px-4 py-2 text-sm transition-colors duration-300"
                           onClick={closeMenu}
                           isAuthenticated={isAuthenticated}
                           showTooltip={false}
                         >
                           Chochasafio
                         </ProtectedLink>
                         <ProtectedLink
                           to="/respiracion"
                           className="text-gray-300 hover:text-white hover:bg-gray-700 block px-4 py-2 text-sm transition-colors duration-300"
                           onClick={closeMenu}
                           isAuthenticated={isAuthenticated}
                           showTooltip={false}
                         >
                           Respiración
                         </ProtectedLink>
                         <ProtectedLink
                            to="/rutinas"
                            className="text-gray-300 hover:text-white hover:bg-gray-700 block px-4 py-2 text-sm transition-colors duration-300"
                            onClick={closeMenu}
                            isAuthenticated={isAuthenticated}
                            showTooltip={false}
                          >
                            Rutinas
                          </ProtectedLink>
                         <div className="border-t border-gray-700 my-1"></div>
                         <ProtectedLink
                           to="/calculadora"
                           className="text-gray-300 hover:text-white hover:bg-gray-700 block px-4 py-2 text-sm transition-colors duration-300"
                           onClick={closeMenu}
                           isAuthenticated={isAuthenticated}
                           showTooltip={false}
                         >
                           Calculadora XP
                         </ProtectedLink>
                         <ProtectedLink
                           to="/testimonios"
                           className="text-gray-300 hover:text-white hover:bg-gray-700 block px-4 py-2 text-sm transition-colors duration-300"
                           onClick={closeMenu}
                           isAuthenticated={isAuthenticated}
                           showTooltip={false}
                         >
                           Testimonios
                         </ProtectedLink>
                       </div>
                     </div>
                   </>
                 )}
               </div>
              
              <ProtectedLink
                to="/sexshop"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                onClick={closeMenu}
                isAuthenticated={isAuthenticated}
              >
                SexShop
              </ProtectedLink>
              
              <Link
                to="/asesorias"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                onClick={closeMenu}
              >
                Asesorías
              </Link>
            </div>
          </div>

          {/* Auth Buttons Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                  onClick={closeMenu}
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm">
                    {user?.user_metadata?.username || user?.email?.split('@')[0] || 'Usuario'}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar sesión</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                  onClick={closeMenu}
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300"
                  onClick={closeMenu}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-300 hover:text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden bg-gray-800 border-t border-gray-700`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">

          <Link
            to="/"
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            onClick={closeMenu}
          >
            Inicio
          </Link>
          

          
          {/* Dropdown de Ejercicios Mobile */}
          <div>
            <button
              onClick={toggleExercises}
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 flex items-center justify-between w-full"
            >
              <span>Ejercicios</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${
                isExercisesOpen ? 'rotate-180' : ''
              }`} />
            </button>
            
            <div className={`pl-4 space-y-1 overflow-hidden transition-all duration-200 ${
               isExercisesOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
             }`}>
               <ProtectedLink
                 to="/keguel"
                 className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                 onClick={closeMenu}
                 isAuthenticated={isAuthenticated}
                 showTooltip={false}
               >
                 Reto Keguel
               </ProtectedLink>
               <ProtectedLink
                 to="/chochasafio"
                 className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                 onClick={closeMenu}
                 isAuthenticated={isAuthenticated}
                 showTooltip={false}
               >
                 Chochasafio
               </ProtectedLink>
               <ProtectedLink
                 to="/respiracion"
                 className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                 onClick={closeMenu}
                 isAuthenticated={isAuthenticated}
                 showTooltip={false}
               >
                 Respiración
               </ProtectedLink>
               <ProtectedLink
                 to="/rutinas"
                 className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                 onClick={closeMenu}
                 isAuthenticated={isAuthenticated}
                 showTooltip={false}
               >
                 Rutinas
               </ProtectedLink>
             </div>
          </div>
          
          <ProtectedLink
            to="/sexshop"
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            onClick={closeMenu}
            isAuthenticated={isAuthenticated}
          >
            Sexshop
          </ProtectedLink>
          
          <Link
            to="/asesorias"
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            onClick={closeMenu}
          >
            Asesorías
          </Link>
          
          {/* Auth Buttons Mobile */}
          <div className="pt-4 pb-3 border-t border-gray-700">
            {isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={closeMenu}
                >
                  <User className="w-4 h-4" />
                  <span className="text-base font-medium">
                    {user?.user_metadata?.username || user?.email?.split('@')[0] || 'Usuario'}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 mt-2 w-full text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Cerrar sesión</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
                  onClick={closeMenu}
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 hover:bg-blue-700 text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 mt-2"
                  onClick={closeMenu}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}