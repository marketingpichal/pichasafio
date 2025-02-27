import { useState } from 'react';

interface AgeVerificationModalProps {
  onVerified: (isVerified: boolean) => void;
}

export default function AgeVerificationModal({ onVerified }: AgeVerificationModalProps) {
  const [isOpen, setIsOpen] = useState(true);

  const handleConfirm = () => {
    setIsOpen(false);
    onVerified(true); // Notifica al padre que el usuario confirmó
  };

  const handleDeny = () => {
    setIsOpen(false);
    onVerified(false); // Notifica al padre que el usuario no pasó
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-4">
          Verificación de Edad
        </h2>
        <p className="text-lg text-gray-200 mb-6">
          Debes ser mayor de 18 años para entrar a Pichasafio.com. ¿Confirmas que tienes 18 o más?
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={handleConfirm}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold py-2 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            Sí, tengo 18+
          </button>
          <button
            onClick={handleDeny}
            className="bg-gray-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-gray-700 transition-all"
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
}