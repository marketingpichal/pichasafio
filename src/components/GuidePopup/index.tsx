import { ShieldCloseIcon, Clock, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { asesoriasLogService } from "../../lib/asesoriasLogService";
import Image from "../../assets/image.png";
import AgrandamientoGuia from "../../assets/agrandamiento-guia.png";

export default function GuidePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 1 minute in seconds
  const [guidesLeft, setGuidesLeft] = useState(15); // Initial number of guides available
  const [offerType, setOfferType] = useState<'single' | 'double'>('single');

  useEffect(() => {
    // Show popup after 1 second
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    // Countdown timer
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          setIsVisible(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(timer);
      clearInterval(countdown);
    };
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleWhatsAppClick = async () => {
    const phoneNumber = "573004048012";
    const message = offerType === 'single' 
      ? "¡Hola! Estoy interesado en la guía de iniciación. ¿Podrías decirme cómo es el método de pago y qué incluye exactamente? ¡Gracias!"
      : "¡Hola! Estoy interesado en la oferta de 2 guías por 35.000. ¿Podrías darme más detalles sobre el pago y qué incluyen ambas guías? ¡Gracias!";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    try {
      // Log the interaction
      await asesoriasLogService.logAsesoriaSubmission({
        nombre: offerType === 'single' ? "Interesado en Guía" : "Interesado en 2 Guías",
        telefono: "No proporcionado",
        motivo: offerType === 'single' ? "Consulta sobre Guía de Iniciación" : "Consulta sobre Oferta 2 Guías",
        descripcion: offerType === 'single' ? "Usuario interesado en la guía de iniciación" : "Usuario interesado en la oferta de 2 guías",
        whatsappUrl: whatsappUrl,
        whatsappNumber: phoneNumber
      });
    } catch (error) {
      console.error("Error al registrar la interacción:", error);
      // Continue with the flow even if logging fails
    }
    
    // Open WhatsApp
    window.open(whatsappUrl, "_blank");
    
    // Decrease counter and close if no more guides
    setGuidesLeft(prev => {
      if (prev <= 1) {
        setIsVisible(false);
        return 0;
      }
      return prev - 1;
    });
  };

  if (!isVisible) return null;

  // Format time as MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[999999] p-2 sm:p-4">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl max-w-[95vw] sm:max-w-md w-full relative overflow-hidden border border-gray-700 shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header with timer */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-2 sm:p-3 text-center font-bold flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base">
          <div className="flex items-center">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 animate-pulse mr-1" />
            <span>¡Oferta por tiempo limitado!</span>
          </div>
          <div>Termina en: {formattedTime}</div>
        </div>

        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white bg-black/30 rounded-full p-1"
          aria-label="Cerrar"
        >
          <ShieldCloseIcon className="h-5 w-5" />
        </button>

        <div className="p-4 sm:p-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-1 sm:mb-2">
            🎁 Guía de Iniciación Premium
          </h2>
          <p className="text-center text-gray-300 text-sm sm:text-base mb-4 sm:mb-6">
            Domina las técnicas más efectivas para mejorar tu vida íntima
          </p>

          {/* Price section */}
          <div className="bg-gray-900/50 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 border border-gray-700">
            <div className="flex items-end justify-center gap-2 sm:gap-4 mb-1 sm:mb-2">
              <div className="text-center">
                <div className="text-gray-400 text-xs sm:text-sm line-through">{offerType === 'single' ? '$34.999' : '$75.000'}</div>
                <div className="text-3xl sm:text-4xl font-bold text-white">{offerType === 'single' ? '$19.999' : '$35.000'}</div>
              </div>
            </div>
            <div className="text-center text-green-400 text-xs sm:text-sm font-medium mb-2">
              ¡Ahorras 56%! Oferta exclusiva
            </div>
            <div className="text-center text-amber-400 text-sm font-semibold">
              🚀 Solo {guidesLeft} guías disponibles
            </div>
          </div>

          {/* Image */}
          <div className="flex justify-center items-center space-x-2 mb-4">
            <button onClick={() => setOfferType('single')} className={`px-4 py-2 rounded-lg text-sm font-bold ${offerType === 'single' ? 'bg-amber-500 text-white' : 'bg-gray-700 text-gray-300'}`}>1 Guía</button>
            <button onClick={() => setOfferType('double')} className={`px-4 py-2 rounded-lg text-sm font-bold ${offerType === 'double' ? 'bg-amber-500 text-white' : 'bg-gray-700 text-gray-300'}`}>2 Guías</button>
          </div>

          {/* Image */}
          <div className="mb-6 relative group flex justify-center items-center space-x-2">
            <img
              src={Image}
              alt="Guía de Iniciación"
              className={`w-1/2 h-auto rounded-lg border-2 ${offerType === 'single' ? 'border-amber-500' : 'border-gray-700'} shadow-lg transform transition-transform group-hover:scale-[1.02]`}
            />
            <img
              src={AgrandamientoGuia}
              alt="Guía de Agrandamiento"
              className={`w-1/2 h-auto rounded-lg border-2 ${offerType === 'double' ? 'border-amber-500' : 'border-gray-700'} shadow-lg transform transition-transform group-hover:scale-[1.02]`}
            />
            <div className="absolute -top-3 -right-3 bg-amber-500 text-black font-bold px-3 py-1 rounded-full text-sm animate-bounce">
              ¡NUEVO!
            </div>
          </div>

          {/* Features */}
          <ul className="space-y-1.5 sm:space-y-2 mb-4 sm:mb-6 text-sm sm:text-base">
            {[
              '✅ Técnicas probadas',
              '✅ Resultados rápidos',
            //   '✅ Soporte 24/7',
              '✅ Acceso vitalicio',
            //   '✅ Garantía'
            ].map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-400 flex-shrink-0">✓</span>
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>

          {/* CTA Button */}
          <button
            onClick={handleWhatsAppClick}
            className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-extrabold py-3 sm:py-4 px-4 sm:px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-amber-500/30 flex items-center justify-center gap-2 group text-sm sm:text-base"
          >
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 group-hover:animate-pulse flex-shrink-0" />
            <span className="truncate">¡QUIERO MI GUÍA AHORA!</span>
          </button>

          {/* Trust badges */}
          <div className="mt-4 text-center text-xs text-gray-400">
            Pago seguro · Garantía de satisfacción
          </div>
        </div>
      </div>
    </div>
  );
}
