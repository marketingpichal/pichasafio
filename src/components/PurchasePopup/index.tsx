import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Clock, Star } from 'lucide-react';

interface PurchasePopupProps {
  isOpen: boolean;
  onClose: () => void;
  onPurchase: () => void;
}

const PurchasePopup: React.FC<PurchasePopupProps> = ({ isOpen, onClose, onPurchase }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Popup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl shadow-2xl border border-gray-700 max-w-md w-full mx-4 overflow-hidden">
              {/* Header */}
              <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-center">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex justify-center mb-3">
                  <div className="bg-white/20 rounded-full p-3">
                    <ShoppingCart className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-2">
                  ¡Oferta Especial!
                </h2>
                
                <div className="flex items-center justify-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <p className="text-white/90 text-sm">
                  Guía Exclusiva para Principiantes
                </p>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    "Guía para tu Primera Vez"
                  </h3>
                  
                  <div className="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-700">
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <span className="text-3xl font-bold text-green-400">$20,000</span>
                      <span className="text-gray-400 line-through text-lg">$35,000</span>
                    </div>
                    <p className="text-gray-300 text-sm">Precio especial de lanzamiento</p>
                  </div>
                  
                  <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-center space-x-2 text-red-400">
                      <Clock className="w-4 h-4" />
                      <span className="font-semibold text-sm">¡Solo quedan 10 unidades!</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-left text-gray-300 text-sm mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Guía paso a paso para principiantes</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Técnicas seguras y efectivas</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Consejos de expertos</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span>Acceso inmediato tras la compra</span>
                    </div>
                  </div>
                </div>
                
                {/* Buttons */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onPurchase}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span>¡Comprar Ahora!</span>
                  </motion.button>
                  
                  <button
                    onClick={onClose}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 border border-gray-600 hover:border-gray-500"
                  >
                    Tal vez después
                  </button>
                </div>
                
                <p className="text-xs text-gray-500 text-center mt-4">
                  * Oferta válida por tiempo limitado
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default PurchasePopup;