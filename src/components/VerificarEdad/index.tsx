import { useState } from 'react';

interface AgeVerificationModalProps {
  onVerified: (isVerified: boolean) => void;
}

export default function AgeVerificationModal({ onVerified }: AgeVerificationModalProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleConfirm = () => {
    setIsOpen(false);
    onVerified(true);
  };

  const handleDeny = () => {
    setIsOpen(false);
    onVerified(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800/90 backdrop-blur-md p-5 sm:p-6 rounded-xl shadow-xl max-w-xs w-full text-center border border-gray-600/30">
        {/* Icon */}
        <div className="mb-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">
          Verificación de Edad
        </h2>
        
        <p className="text-xs sm:text-sm text-gray-300 mb-4 leading-relaxed">
          Debes ser mayor de 18 años para acceder a Pichasafio.com. 
          ¿Confirmas que tienes 18 años o más?
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={handleConfirm}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium py-2 px-3 rounded-md hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-sm"
          >
            Sí, tengo 18+
          </button>
          <button
            onClick={handleDeny}
            className="flex-1 bg-gray-600 text-white font-medium py-2 px-3 rounded-md hover:bg-gray-700 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500/50 text-sm"
          >
            No
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-2">
          Al continuar, confirmas que eres mayor de edad
        </p>
      </div>
    </div>
  );
}