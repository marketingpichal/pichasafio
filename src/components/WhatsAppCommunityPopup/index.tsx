import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageCircle, Users, BookOpen, Video, Star, Clock } from 'lucide-react';

interface WhatsAppCommunityPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinWhatsApp: () => void;
}

export default function WhatsAppCommunityPopup({ 
  isOpen, 
  onClose, 
  onJoinWhatsApp 
}: WhatsAppCommunityPopupProps) {
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
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-gray-700/50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-green-600 to-green-500 p-6 text-white">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/20 transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-white/20 rounded-full">
                  <MessageCircle size={24} />
                </div>
                <h2 className="text-xl font-bold">¡Únete a Nuestra Comunidad!</h2>
              </div>
              
              <p className="text-green-100 text-sm mb-3">
                Acceso GRATIS por tiempo limitado
              </p>

              {/* Temporizador de urgencia */}
              <div className="bg-red-500/90 rounded-lg p-3 border border-red-400">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <Clock size={16} className="text-white" />
                  <span className="text-white font-semibold text-sm">¡OFERTA TERMINA EN!</span>
                </div>
                <div className="text-center">
                  <span className="text-2xl font-bold text-white font-mono">
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">
                  🔥 Comunidad Exclusiva de WhatsApp
                </h3>
                <p className="text-gray-300 text-sm mb-2">
                  Únete a miles de miembros que ya están mejorando su vida íntima
                </p>
                <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-2">
                  <p className="text-yellow-300 text-xs font-semibold">
                    ⚡ ACCESO GRATUITO - SOLO POR TIEMPO LIMITADO ⚡
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                  <BookOpen className="text-blue-400 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-white font-medium text-sm">Guías Exclusivas</p>
                    <p className="text-gray-400 text-xs">Contenido premium solo para miembros</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                  <Video className="text-purple-400 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-white font-medium text-sm">Tutoriales en Video</p>
                    <p className="text-gray-400 text-xs">Aprende con contenido audiovisual</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                  <Users className="text-green-400 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-white font-medium text-sm">Comunidad Activa</p>
                    <p className="text-gray-400 text-xs">Comparte experiencias y consejos</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                  <Star className="text-yellow-400 flex-shrink-0" size={20} />
                  <div>
                    <p className="text-white font-medium text-sm">Tips Diarios</p>
                    <p className="text-gray-400 text-xs">Consejos para ser el mejor cada día</p>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4 space-y-3">
                <button
                  onClick={onJoinWhatsApp}
                  className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2 border-2 border-green-400 animate-pulse"
                >
                  <MessageCircle size={20} />
                  ¡UNIRME GRATIS AHORA!
                </button>
                
                <button
                  onClick={onClose}
                  className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium py-2 px-6 rounded-xl transition-colors"
                >
                  Tal vez más tarde
                </button>
              </div>

              {/* Footer */}
              <div className="text-center pt-2">
                <p className="text-xs text-gray-500 mb-1">
                  🔒 Tu privacidad es importante. Solo contenido de calidad.
                </p>
                <p className="text-xs text-red-400 font-semibold">
                  ⚠️ Esta oferta expira cuando termine el tiempo
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}