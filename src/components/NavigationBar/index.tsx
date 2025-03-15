import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo o título */}
        <div className="text-white text-xl font-bold">
          <Link to="/">Pichasafio</Link>
        </div>

        {/* Enlaces de navegación */}
        <ul className="flex space-x-6 text-white">
          <li>
            <Link
              to="/"
              className="hover:text-gray-300 transition-colors duration-200"
            >
              Inicio
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="hover:text-gray-300 transition-colors duration-200"
            >
              Iniciar sesión
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="hover:text-gray-300 transition-colors duration-200"
            >
              Registrarse
            </Link>
          </li>
          
          <li>
            <Link
            to="/calculadora"
            className="hover:text-gray-300 transition-colors duration-200">
            Calculadora XP 
            </Link>
          </li>
          <li>
            <Link
            to="/keguel"
            className="hover:text-gray-300 transition-colors duration-200">
            Reto de keguel
            </Link>
          </li>
          <li>
            <Link
            to="/respiracion"
            className="hover:text-gray-300 transition-colors duration-200">
            Reto de respiracion
            </Link>
          </li>
          <li>
            <Link
            to="/testimonios"
            className="hover:text-gray-300 transition-colors duration-200">
            Testimonios
            </Link>
          </li>
        



        </ul>
      </div>
    </nav>
  );
}   