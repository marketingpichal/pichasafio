import { useState, useEffect } from "react";
import { X, Heart } from "lucide-react";

const STORAGE_KEY = "donation-banner-dismissed";

export default function DonationBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Check if banner was dismissed in this session (not persistent across reloads)
    const isDismissed = false
    if (!isDismissed) {
      // Small delay for smooth entrance animation
      setTimeout(() => setIsVisible(true), 500);
    }
  }, []);

  const handleDismiss = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      // Use sessionStorage instead of localStorage for temporary dismissal
      sessionStorage.setItem(STORAGE_KEY, "true");
    }, 300);
  };

  const handleDonate = () => {
    window.open("https://checkout.wompi.co/l/VPOS_e28TbP", "_blank");
  };

  if (!isVisible) return null;

  return (
    <div
      className={`relative bg-gradient-to-r from-yellow-50 to-amber-50 border-b-2 border-yellow-400/30 transition-all duration-300 ${
        isClosing ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Message Section */}
          <div className="flex-1 flex items-start gap-3 pr-8 sm:pr-0">
            <div className="flex-shrink-0 mt-1">
              <Heart className="w-6 h-6 sm:w-7 sm:h-7 text-red-500 fill-red-500 animate-pulse" />
            </div>
            <div className="flex-1">
              <p className="text-gray-900 text-sm sm:text-base leading-relaxed">
                <span className="font-semibold">
                  Para todos los que usan Pichasafio:
                </span>{" "}
                ha llegado el momento de pedirte algo. Mantenemos este sitio
                gratuito para que puedas mejorar tu salud íntima sin barreras.
                Si Pichasafio te ha sido útil, considera hacer una donación.{" "}
                <span className="font-medium">
                  Incluso un pequeño aporte marca la diferencia.
                </span>
              </p>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex-shrink-0 w-full sm:w-auto">
            <button
              onClick={handleDonate}
              className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-gray-900 font-semibold px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Donar Ahora</span>
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3 right-3 sm:relative sm:top-0 sm:right-0 p-1.5 hover:bg-yellow-200/50 rounded-full transition-colors duration-200 group"
            aria-label="Cerrar banner"
          >
            <X className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
}
