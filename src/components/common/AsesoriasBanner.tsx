import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, ArrowRight } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ASESORIAS_CONFIG, shouldShowAsesorias } from "./AsesoriasConfig";

interface AsesoriasBannerProps {
  variant?: "top" | "inline";
  className?: string;
}

const AsesoriasBanner: React.FC<AsesoriasBannerProps> = ({ 
  variant = "top", 
  className = "" 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [shouldShow, setShouldShow] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Verificar si debe mostrar el banner en la página actual
    const show = shouldShowAsesorias(location.pathname, 'banner');
    setShouldShow(show);
  }, [location.pathname]);

  if (!isVisible || !shouldShow) return null;

  if (variant === "top") {
    return (
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 text-white py-3 px-4 shadow-lg relative z-40"
          >
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-yellow-300" />
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{ASESORIAS_CONFIG.BANNER.TEXT.TITLE}</span>
                  <span className="text-sm opacity-90">Asesorías desde ${ASESORIAS_CONFIG.PRECIO}</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <Link
                  to="/asesorias"
                  className="bg-white text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 flex items-center space-x-2"
                >
                  <span>{ASESORIAS_CONFIG.BANNER.TEXT.CTA}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                
                <button
                  onClick={() => setIsVisible(false)}
                  className="text-white hover:text-gray-200 transition-colors duration-200"
                  aria-label="Cerrar banner"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Variante inline para insertar en contenido
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 rounded-xl p-6 ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <MessageCircle className="w-6 h-6 text-white" />
          </div>
          
          <div>
            <h3 className="text-lg font-bold text-white mb-1">
              {ASESORIAS_CONFIG.BANNER.TEXT.TITLE}
            </h3>
            <p className="text-gray-300 text-sm">
              Obtén asesoría experta por solo ${ASESORIAS_CONFIG.PRECIO} por {ASESORIAS_CONFIG.DURACION}
            </p>
          </div>
        </div>
        
        <Link
          to="/asesorias"
          className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 flex items-center space-x-2"
        >
          <span>Solicitar Asesoría</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  );
};

export default AsesoriasBanner;
