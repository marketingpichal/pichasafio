// src/components/Footer.js
export default function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <h3 className="text-xl font-bold text-white mb-4">Pichasafio.com</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tu comunidad para mejorar tu salud íntima y bienestar personal.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-white mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/calculadora" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Calculadora XP
                </a>
              </li>
              <li>
                <a href="/keguel" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Reto Keguel
                </a>
              </li>
              <li>
                <a href="/respiracion" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Respiración
                </a>
              </li>
              <li>
                <a href="/rutinas" className="text-gray-400 hover:text-white transition-colors duration-200">
                  Rutinas
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="text-center md:text-left">
            <h4 className="text-lg font-semibold text-white mb-4">Apoyo</h4>
            <div className="space-y-2 text-sm">
              <p className="text-gray-400">
                Dona a Nequi o Binance
              </p>
              <p className="text-gray-400">
                Hecho con sexo y código
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Pichasafio.com - Todos los derechos reservados
          </p>
        </div>
      </div>
    </footer>
  );
}