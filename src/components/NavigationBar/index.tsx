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
            
          </li>
        </ul>
      </div>
    </nav>
  );
}   