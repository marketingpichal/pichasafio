import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, ChefHat, Heart, Flame, Clock } from 'lucide-react';

interface RecipesPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinWhatsApp: () => void;
}

export default function RecipesPopup({ 
  isOpen, 
  onClose, 
  onJoinWhatsApp 
}: RecipesPopupProps) {
  // Temporizador de 10 minutos (600 segundos)
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gradient-to-br from-gray-900 to-black rounded-2xl max-w-md w-full relative overflow-hidden border border-gray-700 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header con mensaje de urgencia */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-3 text-center">
              <p className="text-sm font-semibold">🔥 RECETAS GRATIS POR TIEMPO LIMITADO 🔥</p>
            </div>

            {/* Temporizador */}
            <div className="bg-red-600 text-white p-2 text-center">
              <div className="flex items-center justify-center gap-2">
                <Clock className="h-4 w-4 animate-pulse" />
                <span className="text-sm font-bold">¡OFERTA TERMINA EN!</span>
              </div>
              <div className="text-lg font-bold text-center">
                {formatTime(timeLeft)}
              </div>
            </div>

            {/* Botón de cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10 bg-black/30 rounded-full p-1"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Contenido principal */}
            <div className="p-6">
              {/* Título principal */}
              <div className="text-center mb-4">
                <div className="flex items-center justify-center mb-2">
                  <ChefHat className="h-8 w-8 text-orange-500 mr-2" />
                  <h2 className="text-2xl font-bold text-white">¡Recetas Afrodisíacas!</h2>
                </div>
                <p className="text-gray-300 text-sm">
                  Mejora tu rendimiento con recetas naturales
                </p>
              </div>

              {/* Banner de urgencia */}
              <div className="bg-yellow-500/20 border border-yellow-500 rounded-lg p-3 mb-4">
                <p className="text-yellow-300 text-center font-bold text-sm">
                  ⚡ ACCESO GRATUITO - SOLO POR TIEMPO LIMITADO ⚡
                </p>
              </div>

              {/* Contenido */}
              <p className="text-gray-300 text-center mb-4">
                Descubre recetas secretas que han sido utilizadas durante siglos para mejorar el rendimiento y la energía natural.
              </p>

              {/* Lista de beneficios */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center text-gray-300">
                  <Heart className="h-5 w-5 text-red-500 mr-3 flex-shrink-0" />
                  <span className="text-sm">Recetas naturales y efectivas</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Flame className="h-5 w-5 text-orange-500 mr-3 flex-shrink-0" />
                  <span className="text-sm">Ingredientes fáciles de conseguir</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <ChefHat className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                  <span className="text-sm">Preparación paso a paso</span>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="space-y-3">
                <button
                  onClick={onJoinWhatsApp}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 border-2 border-green-400 animate-pulse"
                >
                  <div className="flex items-center justify-center">
                    <MessageCircle className="h-5 w-5 mr-2" />
                    ¡OBTENER RECETAS GRATIS!
                  </div>
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 py-2 px-4 rounded-lg transition-colors"
                >
                  Tal vez más tarde
                </button>
              </div>

              {/* Footer con urgencia */}
              <p className="text-red-400 text-center text-xs mt-3 font-medium">
                ⏰ Esta oferta expira en {formatTime(timeLeft)} - ¡No la pierdas!
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}