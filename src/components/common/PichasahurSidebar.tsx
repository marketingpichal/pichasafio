import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, Star, Zap } from 'lucide-react';
import PichasahurMascot from './PichasahurMascot';
import PichasahurComicBanner from './PichasahurComicBanner';

interface PichasahurSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const PichasahurSidebar: React.FC<PichasahurSidebarProps> = ({ isOpen, onClose }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const messages = [
    {
      text: "¡Hola! Soy Pichasahur, tu compañero de aventuras en este viaje de automejora! 🐾",
      icon: <Heart className="w-5 h-5 text-red-400" />
    },
    {
      text: "¿Listo para conquistar nuevos retos? ¡Juntos somos más fuertes! ⚡",
      icon: <Zap className="w-5 h-5 text-yellow-400" />
    },
    {
      text: "Recuerda: la consistencia es la clave del éxito. ¡Tú puedes lograrlo! 🌟",
      icon: <Star className="w-5 h-5 text-blue-400" />
    }
  ];

  useEffect(() => {
    if (isOpen) {
      const interval = setInterval(() => {
        setCurrentMessage((prev) => (prev + 1) % messages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, messages.length]);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[9999]"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-80 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 shadow-2xl z-[10000] border-l border-blue-400/20"
          >
            {/* Header */}
            <div className="relative p-6 border-b border-blue-400/20">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="flex items-center justify-center mb-4">
                <PichasahurComicBanner size="small" animated={true} variant="action" />
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 overflow-y-auto h-full">
              {/* Mascot Section */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex justify-center"
              >
                <div className="relative">
                  <PichasahurMascot size={120} animated={true} />
                  
                  {/* Floating elements */}
                  <motion.div
                    animate={{ 
                      y: [-10, 10, -10],
                      rotate: [0, 5, 0]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400/60 rounded-full"
                  />
                  <motion.div
                    animate={{ 
                      y: [10, -10, 10],
                      rotate: [0, -5, 0]
                    }}
                    transition={{ 
                      duration: 2.5, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    className="absolute -bottom-2 -left-2 w-3 h-3 bg-orange-400/60 rounded-full"
                  />
                </div>
              </motion.div>

              {/* Message Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-4 border border-blue-400/30"
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentMessage}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-start gap-3"
                  >
                    {messages[currentMessage].icon}
                    <p className="text-gray-200 text-sm leading-relaxed">
                      {messages[currentMessage].text}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </motion.div>

              {/* Stats Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Tu Progreso
                </h3>
                
                <div className="space-y-3">
                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 text-sm">Días consecutivos</span>
                      <span className="text-blue-400 font-bold">7</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "70%" }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300 text-sm">Rutinas completadas</span>
                      <span className="text-green-400 font-bold">12</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: "60%" }}
                        transition={{ delay: 1, duration: 1 }}
                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-3"
              >
                <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                  Acciones Rápidas
                </h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                  >
                    Ver Rutinas
                  </motion.button>
                  
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-3 rounded-lg text-sm font-semibold hover:from-green-700 hover:to-blue-700 transition-all"
                  >
                    Calculadora
                  </motion.button>
                </div>
              </motion.div>
            </div>

            {/* Confetti Effect */}
            {showConfetti && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ 
                      y: -20, 
                      x: Math.random() * 320,
                      opacity: 1,
                      scale: 0
                    }}
                    animate={{ 
                      y: 800,
                      opacity: 0,
                      scale: 1
                    }}
                    transition={{ 
                      duration: 2,
                      delay: Math.random() * 0.5
                    }}
                    className="absolute w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"
                  />
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PichasahurSidebar;
