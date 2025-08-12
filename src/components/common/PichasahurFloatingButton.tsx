import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import PichasahurMascot from './PichasahurMascot';

interface PichasahurFloatingButtonProps {
  onClick: () => void;
  isVisible: boolean;
}

const PichasahurFloatingButton: React.FC<PichasahurFloatingButtonProps> = ({ 
  onClick, 
  isVisible 
}) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: isVisible ? 1 : 0, 
        opacity: isVisible ? 1 : 0 
      }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="fixed bottom-6 right-6 z-[9998] cursor-pointer group"
    >
      {/* Main button */}
      <div className="relative">
        {/* Background glow */}
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-lg"
        />
        
        {/* Button container */}
        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-full p-3 shadow-2xl border-2 border-white/20 hover:border-white/40 transition-all duration-300">
          {/* Mascot */}
          <div className="relative">
            <PichasahurMascot size={40} animated={true} />
            
            {/* Sparkle effect */}
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute -top-1 -right-1"
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileHover={{ opacity: 1, x: 0 }}
        className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg border border-gray-700"
      >
        ¡Hola! Soy Pichasahur 🐾
        <div className="absolute left-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-t-4 border-t-transparent border-b-4 border-b-transparent"></div>
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -20, 0],
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{ 
              duration: 2,
              delay: i * 0.4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full"
            style={{
              left: `${20 + i * 15}%`,
              top: `${30 + i * 10}%`
            }}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default PichasahurFloatingButton;
