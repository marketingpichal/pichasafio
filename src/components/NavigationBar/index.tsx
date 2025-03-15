import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import { AuthContext } from "@/context/AuthProvider";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="text-white text-xl font-bold">
            <Link to="/">Pichasafio</Link>
          </div>

          {/* Hamburger Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex space-x-6 text-white">
            <li>
              <Link to="/" className="hover:text-gray-300 transition-colors duration-200">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/calculadora" className="hover:text-gray-300 transition-colors duration-200">
                Calculadora XP
              </Link>
            </li>
            <li>
              <Link to="/keguel" className="hover:text-gray-300 transition-colors duration-200">
                Reto de keguel
              </Link>
            </li>
            <li>
              <Link to="/respiracion" className="hover:text-gray-300 transition-colors duration-200">
                Reto de respiracion
              </Link>
            </li>
            <li>
              <Link to="/testimonios" className="hover:text-gray-300 transition-colors duration-200">
                Testimonios
              </Link>
            </li>
            {!user ? (
              <>
                <li>
                  <Link to="/login" className="hover:text-gray-300 transition-colors duration-200">
                    Iniciar sesión
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:text-gray-300 transition-colors duration-200">
                    Registrarse
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={logout}
                  className="hover:text-gray-300 transition-colors duration-200"
                >
                  Cerrar sesión
                </button>
              </li>
            )}
          </ul>
        </div>

        {/* Mobile Navigation */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden mt-4`}>
          <ul className="flex flex-col space-y-4 text-white">
            <li>
              <Link to="/" className="block hover:text-gray-300 transition-colors duration-200">
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/calculadora" className="block hover:text-gray-300 transition-colors duration-200">
                Calculadora XP
              </Link>
            </li>
            <li>
              <Link to="/keguel" className="block hover:text-gray-300 transition-colors duration-200">
                Reto de keguel
              </Link>
            </li>
            <li>
              <Link to="/respiracion" className="block hover:text-gray-300 transition-colors duration-200">
                Reto de respiracion
              </Link>
            </li>
            <li>
              <Link to="/testimonios" className="block hover:text-gray-300 transition-colors duration-200">
                Testimonios
              </Link>
            </li>
            {!user ? (
              <>
                <li>
                  <Link to="/login" className="block hover:text-gray-300 transition-colors duration-200">
                    Iniciar sesión
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="block hover:text-gray-300 transition-colors duration-200">
                    Registrarse
                  </Link>
                </li>
              </>
            ) : (
              <li>
                <button
                  onClick={logout}
                  className="block hover:text-gray-300 transition-colors duration-200"
                >
                  Cerrar sesión
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}