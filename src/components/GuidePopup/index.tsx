import { MessageCircle, AlertTriangle, Clock, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { asesoriasLogService } from "../../lib/asesoriasLogService";

export default function GuidePopup() {
  const [isVisible, setIsVisible] = useState(false);
  const [showCloseButton, setShowCloseButton] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutos en segundos
  const [availableSpots, setAvailableSpots] = useState(
    Math.floor(Math.random() * 10) + 5
  ); // Entre 5 y 15 cupos
  const phoneNumber = "573004048012";
  const message =
    "¡Hola! Quiero unirme a la comunidad VIP de Pichasafio. ¿Cómo puedo acceder a los beneficios?";
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  useEffect(() => {
    // Mostrar el popup después de 3 segundos
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    // Temporizador de cuenta regresiva
    const countdown = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdown);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Reducir cupos aleatoriamente para crear urgencia
    const spotTimer = setInterval(() => {
      if (Math.random() > 0.7 && availableSpots > 0) {
        setAvailableSpots((prev) => Math.max(0, prev - 1));
      }
    }, 10000);

    return () => {
      clearTimeout(showTimer);
      clearInterval(countdown);
      clearInterval(spotTimer);
    };
  }, [availableSpots]);

  // Obtener la ruta actual
  const location = useLocation();

  // Efecto para detectar cambios de ruta
  useEffect(() => {
    const targetRoutes = ['/login', '/register', '/rutinas', '/keguel', '/respiracion', '/chochasafio'];
    
    // Verificar si la ruta actual está en la lista de rutas objetivo
    if (targetRoutes.some(route => location.pathname.startsWith(route))) {
      // Esperar un momento para asegurar que la página se haya cargado
      const timer = setTimeout(() => {
        // Reiniciar el temporizador y mostrar el popup
        setTimeLeft(120);
        setAvailableSpots(Math.floor(Math.random() * 10) + 5);
        setIsVisible(true);
        
        // Mostrar el botón de cierre después de 5 segundos
        const closeButtonTimer = setTimeout(() => {
          setShowCloseButton(true);
        }, 5000);
        
        return () => clearTimeout(closeButtonTimer);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);
  
  // Efecto para mostrar el popup después de 3 segundos en cualquier página
  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true);
      // Mostrar el botón de cierre después de 5 segundos
      const closeButtonTimer = setTimeout(() => {
        setShowCloseButton(true);
      }, 5000);
      
      return () => clearTimeout(closeButtonTimer);
    }, 3000);

    return () => clearTimeout(showTimer);
  }, []);

  const handleWhatsAppClick = async () => {
    try {
      await asesoriasLogService.logAsesoriaSubmission({
        nombre: "Interesado en Guías",
        telefono: "No proporcionado",
        motivo: "Consulta sobre Guías de Iniciación",
        descripcion: "Usuario interesado en las guías",
        whatsappUrl: whatsappUrl,
        whatsappNumber: phoneNumber,
      });
    } catch (error) {
      console.error("Error al registrar la interacción:", error);
    }

    window.open(whatsappUrl, "_blank");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  // Formatear el tiempo restante en MM:SS
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return (
    <div className="fixed inset-0 bg-black/70 z-[999999] flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full overflow-hidden border-2 sm:border-4 border-amber-400 mx-2">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-amber-500 p-3 sm:p-4 text-white font-bold flex flex-col items-center text-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-1 sm:gap-2 text-amber-200">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">OFERTA POR TIEMPO LIMITADO</span>
            </div>
            {showCloseButton && (
              <button 
                onClick={() => setIsVisible(false)}
                className="text-amber-200 hover:text-white transition-colors"
                aria-label="Cerrar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
          </div>
          <h3 className="text-lg sm:text-2xl font-extrabold">
            ¡ÚNETE A NUESTRA COMUNIDAD VIP GRATIS!
          </h3>
          <div className="mt-2 bg-black/20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-normal">
            <span>Disponible solo por hoy</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6">
          <div className="text-center mb-4 sm:mb-6">
            <h2 className="text-xl sm:text-3xl font-extrabold text-gray-800 mb-2 sm:mb-3">
              ¡Pocos cupos disponibles!
            </h2>
            <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6">
              Únete ahora y accede a beneficios exclusivos de nuestra comunidad
              VIP
            </p>

            {/* Contador de tiempo */}
            <div className="bg-gray-100 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
              <div className="flex items-center justify-center gap-1 sm:gap-2 text-gray-600 mb-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                <span className="text-xs sm:text-sm">La oferta termina en:</span>
              </div>
              <div className="text-2xl sm:text-4xl font-black text-red-600 font-mono">
                {formattedTime}
              </div>
            </div>

            {/* Contador de cupos */}
            <div className="bg-amber-50 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border border-amber-200">
              <div className="flex items-center justify-center gap-1 sm:gap-2 text-amber-800">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm font-medium">Cupos disponibles:</span>
                <span className="font-black text-lg sm:text-xl">{availableSpots}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 sm:h-2.5 mt-2">
                <div
                  className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 sm:h-2.5 rounded-full"
                  style={{ width: `${(availableSpots / 15) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
            <div className="flex items-start space-x-2 sm:space-x-3 bg-green-50 p-3 sm:p-4 rounded-lg border border-green-100">
              <div className="flex-shrink-0 mt-1">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-sm sm:text-lg">
                  ¡Últimos cupos disponibles!
                </h4>
                <p className="text-xs sm:text-sm text-gray-600">
                  Asegura tu acceso a la comunidad VIP antes de que se agoten
                  los cupos
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleWhatsAppClick}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-extrabold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 sm:gap-3 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-green-500/30 text-sm sm:text-lg"
          >
            <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" />
            <span className="text-center">¡QUIERO MI CUPO GRATIS AHORA!</span>
          </button>
        </div>
      </div>
    </div>
  );
}
