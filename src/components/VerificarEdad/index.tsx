import { useState } from 'react';
import { Link } from 'react-router-dom';

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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
      <div className="bg-stone-900 p-5 sm:p-6 rounded-xl shadow-2xl shadow-red-900/20 max-w-xs w-full text-center border-2 border-red-600">
        {/* Icon */}
        <div className="mb-3">
          <div className="w-12 h-12 bg-red-600/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
        </div>

        <h2 className="text-xl sm:text-2xl font-poppins-bold uppercase tracking-wide text-white mb-2">
          Verificación de Edad
        </h2>

        <p className="text-xs sm:text-sm text-gray-300 mb-4 leading-relaxed">
          Debes ser mayor de 18 años para acceder a Pichasafio.com.
          ¿Confirmas que tienes 18 años o más?
        </p>

        <div className="flex flex-col sm:flex-row gap-2 mt-6">
          <button
            onClick={handleConfirm}
            className="flex-1 bg-red-600 text-white font-poppins-bold uppercase tracking-wide py-3 px-3 rounded-md hover:bg-red-700 transition-colors duration-200 text-xs shadow-lg shadow-red-900/30"
          >
            Sí, tengo 18+ y acepto los tyc
          </button>
          <button
            onClick={handleDeny}
            className="flex-1 bg-stone-800 text-gray-300 font-poppins-bold uppercase tracking-wide py-3 px-3 rounded-md hover:bg-stone-700 hover:text-white border border-stone-700 transition-colors duration-200 text-xs"
          >
            No
          </button>
        </div>

        <p className="text-xs text-gray-500 mt-4 leading-tight">
          Al continuar, confirmas que eres mayor de edad y que aceptas nuestros{" "}
          <Link to="/tyc" className="text-red-500 hover:text-red-400 underline transition-colors">
            Términos y Condiciones
          </Link>
        </p>

      </div>
    </div>
  );
}