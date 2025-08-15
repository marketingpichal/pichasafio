import { Link } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gray-800 shadow-lg sticky top-0 z-[10000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              to="/" 
              className="text-white text-xl font-bold hover:text-blue-400 transition-colors duration-200"
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
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                onClick={closeMenu}
              >
                Inicio
              </Link>
              <Link
                to="/calculadora"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                onClick={closeMenu}
              >
                Calculadora XP
              </Link>
              <Link
                to="/keguel"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                onClick={closeMenu}
              >
                Reto Keguel
              </Link>
              <Link
                to="/chochasafio"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                onClick={closeMenu}
              >
                Chochasafio
              </Link>
              <Link
                to="/respiracion"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                onClick={closeMenu}
              >
                Respiración
              </Link>
            
              <Link
                to="/testimonios"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                onClick={closeMenu}
              >
                Testimonios
              </Link>
              <Link
                to="/rutinas"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                onClick={closeMenu}
              >
                Rutinas
              </Link>
            </div>
          </div>

          {/* Auth Buttons Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              onClick={closeMenu}
            >
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              onClick={closeMenu}
            >
              Registrarse
            </Link>
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
          <Link
            to="/calculadora"
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            onClick={closeMenu}
          >
            Calculadora XP
          </Link>
          <Link
            to="/keguel"
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            onClick={closeMenu}
          >
            Reto Keguel
          </Link>
          <Link
            to="/chochasafio"
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            onClick={closeMenu}
          >
            Chochasafio
          </Link>
          <Link
            to="/sexshop"
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            onClick={closeMenu}
          >
            Sexshop
          </Link>
          <Link
            to="/respiracion"
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            onClick={closeMenu}
          >
            Respiración
          </Link>
          <Link
            to="/testimonios"
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            onClick={closeMenu}
          >
            Testimonios
          </Link>
          <Link
            to="/rutinas"
            className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200"
            onClick={closeMenu}
          >
            Rutinas
          </Link>
          
          {/* Auth Buttons Mobile */}
          <div className="pt-4 pb-3 border-t border-gray-700">
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
          </div>
        </div>
      </div>
    </nav>
  );
}