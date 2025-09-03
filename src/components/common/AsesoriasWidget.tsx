import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, DollarSign } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ASESORIAS_CONFIG, shouldShowAsesorias } from "./AsesoriasConfig";

const AsesoriasWidget: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible] = useState(true);
  const [shouldShow, setShouldShow] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Verificar si debe mostrar el widget en la página actual
    const show = shouldShowAsesorias(location.pathname, 'widget');
    setShouldShow(show);
    
    if (show) {
      // Mostrar después del delay configurado
      const timer = setTimeout(() => {
        setShouldShow(true);
      }, ASESORIAS_CONFIG.WIDGET.SHOW_DELAY * 1000);
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };



  if (!isVisible || !shouldShow) return null;

  return (
    <>
      {/* Widget flotante principal */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ 
          type: "spring", 
          stiffness: 260, 
          damping: 20,
          delay: 2 // Aparece después de 2 segundos
        }}
        className="fixed bottom-6 right-6 z-50"
      >
        {/* Botón principal cuando está colapsado */}
        {!isExpanded && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleExpanded}
            className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300 group"
            aria-label="Abrir widget de asesorías"
          >
            <MessageCircle className="w-6 h-6" />
            
            {/* Indicador de precio flotante */}
            <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full shadow-lg">
              ${ASESORIAS_CONFIG.PRECIO.split(' ')[0]}
            </div>
            
            {/* Tooltip */}
                          <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg border border-gray-700">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-yellow-400" />
                  <span>Asesorías desde ${ASESORIAS_CONFIG.PRECIO}</span>
                </div>
                <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
              </div>
          </motion.button>
        )}

        {/* Widget expandido */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute bottom-0 right-0 w-80 bg-gray-900 rounded-2xl shadow-2xl border border-gray-700 overflow-hidden"
            >
              {/* Header del widget */}
              <div className="bg-gradient-to-r from-green-500 to-blue-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="w-6 h-6" />
                    <div>
                      <h3 className="font-bold text-lg">Asesorías Personalizadas</h3>
                      <p className="text-sm opacity-90">{ASESORIAS_CONFIG.DURACION} por ${ASESORIAS_CONFIG.PRECIO}</p>
                    </div>
                  </div>
                  <button
                    onClick={toggleExpanded}
                    className="text-white hover:text-gray-200 transition-colors duration-200"
                    aria-label="Cerrar widget"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Contenido del widget */}
              <div className="p-4 space-y-4">
                {/* Beneficios rápidos */}
                <div className="space-y-3">
                  {ASESORIAS_CONFIG.BENEFICIOS.map((beneficio, index) => (
                    <div key={index} className="flex items-center space-x-3 text-gray-300">
                      <div className={`w-2 h-2 rounded-full ${
                        index === 0 ? 'bg-green-400' : 
                        index === 1 ? 'bg-blue-400' : 'bg-purple-400'
                      }`}></div>
                      <span className="text-sm">{beneficio}</span>
                    </div>
                  ))}
                </div>

                {/* Motivos populares */}
                <div>
                  <h4 className="font-semibold text-white mb-2 text-sm">Motivos más consultados:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {ASESORIAS_CONFIG.MOTIVOS_POPULARES.map((motivo, index) => (
                      <span key={index} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded">
                        {motivo}
                      </span>
                    ))}
                  </div>
                </div>

                {/* CTA principal */}
                <Link
                  to="/asesorias"
                  onClick={toggleExpanded}
                  className="block w-full bg-gradient-to-r from-green-600 to-blue-600 text-white text-center py-3 px-4 rounded-xl font-semibold hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Solicitar Asesoría Ahora
                </Link>

                {/* Información adicional */}
                <div className="text-center">
                  <p className="text-xs text-gray-400">
                    💰 Precio único: ${ASESORIAS_CONFIG.PRECIO}
                  </p>
                  <p className="text-xs text-gray-400">
                    ⏱️ Duración: {ASESORIAS_CONFIG.DURACION}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Overlay para cerrar cuando está expandido */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/20 z-40"
          onClick={toggleExpanded}
        />
      )}
    </>
  );
};

export default AsesoriasWidget;
