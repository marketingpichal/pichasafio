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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 sm:p-8 rounded-2xl shadow-2xl max-w-md w-full text-center border border-gray-700">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-4">
          Verificación de Edad
        </h2>
        
        <p className="text-base sm:text-lg text-gray-200 mb-6 leading-relaxed">
          Debes ser mayor de 18 años para acceder a Pichasafio.com. 
          ¿Confirmas que tienes 18 años o más?
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={handleConfirm}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-500/50"
          >
            Sí, tengo 18+
          </button>
          <button
            onClick={handleDeny}
            className="flex-1 bg-gray-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-gray-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-gray-500/50"
          >
            No
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-4">
          Al continuar, confirmas que eres mayor de edad
        </p>
      </div>
    </div>
  );
}