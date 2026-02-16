import { MessageCircle, AlertTriangle, Clock } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthProvider";
import { rewardsService } from "@/lib/rewardsService";

const PHONE_NUMBER = "573004048012";
const BASE_PRICE = 25000;

export default function GuidePopup() {
  const { user } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutos
  const [availableSpots, setAvailableSpots] = useState(
    Math.floor(Math.random() * 10) + 5
  ); // Entre 5 y 15 cupos
  const [discount, setDiscount] = useState(0);
  const [finalPrice, setFinalPrice] = useState(BASE_PRICE);

  // Load XP discount
  useEffect(() => {
    if (!user) return;
    rewardsService.getUserDiscount(user.id).then(({ percent }) => {
      setDiscount(percent);
      setFinalPrice(Math.round(BASE_PRICE * (1 - percent / 100)));
    });
  }, [user]);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const countdown = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, [isVisible]);

  useEffect(() => {
    const spotTimer = setInterval(() => {
      if (Math.random() > 0.7 && availableSpots > 0) {
        setAvailableSpots((prev) => Math.max(0, prev - 1));
      }
    }, 10000);

    return () => clearInterval(spotTimer);
  }, [availableSpots]);

  const handleWhatsAppClick = useCallback(async () => {
    const priceText = finalPrice.toLocaleString('es-CO');
    const discountText = discount > 0 ? ` (con mi descuento de ${discount}% por XP)` : '';
    const message = `🔥 Hola, quiero acceder a las 3 guías secretas de Pichasafio por $${priceText} COP${discountText}. Estoy interesado en mejorar mi rendimiento sexual (agrandamiento, durar más y sorprender en la cama). ¿Cómo puedo pagar?`;
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    try {
      window.open(url, "_blank");
      setIsVisible(false);
    } catch (error) {
      console.error("Error al registrar el envío:", error);
      window.open(url, "_blank");
      setIsVisible(false);
    }
  }, [finalPrice, discount]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 z-[999999] flex items-start sm:items-center justify-center p-2 sm:p-4 overflow-y-auto"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full overflow-hidden border-2 sm:border-4 border-amber-400 mx-2 my-4 relative max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-2 right-2 sm:top-3 sm:right-3 text-gray-400 hover:text-gray-600 transition-colors z-10"
          aria-label="Cerrar"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <line x1="6" y1="6" x2="18" y2="18"></line>
            <line x1="6" y1="18" x2="18" y2="6"></line>
          </svg>
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-amber-500 p-3 sm:p-4 text-white font-bold flex flex-col items-center text-center">
          <div className="flex items-center justify-center w-full">
            <div className="flex items-center gap-1 sm:gap-2 text-amber-200">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-xs sm:text-sm">
                SOLO POR TIEMPO LIMITADO
              </span>
            </div>
          </div>
          <h3 className="text-lg sm:text-2xl font-extrabold">
            ¡GUÍAS SECRETAS DISPONIBLES!
          </h3>
          <div className="mt-2 bg-black/20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-normal">
            <span>Acceso inmediato por WhatsApp</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-3 sm:p-4 md:p-6">
          <div className="text-center mb-3 sm:mb-6">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-gray-800 mb-2 sm:mb-3">
              ¿Quieres mejorar tu rendimiento en la cama?
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-gray-700 mb-3 sm:mb-6">
              Accede a <b>3 guías secretas</b> usadas por más de{" "}
              <b>+100 hombres</b> para{" "}
              <u>ganar tamaño, durar más y sorprender en la cama</u>. <br />
              {discount > 0 ? (
                <>
                  Solo hoy por{" "}
                  <span className="line-through text-gray-400">$25.000</span>{" "}
                  <b className="text-green-600">${finalPrice.toLocaleString('es-CO')} COP</b>
                  <span className="ml-1 inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded-full">
                    -{discount}% por tu XP
                  </span>
                </>
              ) : (
                <>Solo hoy por <b>$25.000 COP</b>.</>
              )}
            </p>

            {/* Contador */}
            <div className="bg-gray-100 rounded-lg sm:rounded-xl p-3 mb-4 sm:mb-6">
              <div className="flex items-center justify-center gap-1 sm:gap-2 text-gray-600 mb-2">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-500" />
                <span className="text-xs sm:text-sm">
                  La oferta termina en:
                </span>
              </div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-black text-red-600 font-mono">
                {formattedTime}
              </div>
              <div className="mt-1 text-xs text-gray-500">
                Cupos disponibles: {availableSpots}
              </div>
            </div>

            {/* Lista de objetivos */}
            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-2 sm:p-3 mb-4 sm:mb-6 border border-blue-200">
              <div className="text-center mb-2 sm:mb-3">
                <span className="text-xs font-medium text-blue-800">
                  Elige tu objetivo principal:
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-blue-700">
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></div>
                  <span>Ganar tamaño</span>
                </div>
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></div>
                  <span>Sexo oral experto</span>
                </div>
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></div>
                  <span>Durar más</span>
                </div>
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></div>
                  <span>Mejorar en la cama</span>
                </div>
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></div>
                  <span>Poses sexuales</span>
                </div>
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></div>
                  <span>Primera vez</span>
                </div>
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></div>
                  <span>Masajes eróticos</span>
                </div>
                <div className="flex items-center">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-1.5"></div>
                  <span>Fantasías sexuales</span>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={handleWhatsAppClick}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-extrabold py-2.5 sm:py-3 px-3 sm:px-4 rounded-lg sm:rounded-xl flex items-center justify-center gap-1.5 sm:gap-2 transition-all duration-300 transform hover:scale-[1.02] shadow-md hover:shadow-green-500/30 text-xs sm:text-sm md:text-base whitespace-normal"
          >
            <MessageCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
            <span className="text-center">
              🔥 QUIERO MI PLAN DE MEJORA SEXUAL
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
