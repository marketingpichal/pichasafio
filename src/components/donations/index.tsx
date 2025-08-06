import { Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import NequiQR from "../../assets/NequiQR.jpeg";

export default function DonationBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`transition-all duration-1000 transform ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-[#2C0054] via-[#4C1D95] to-[#FF0099] p-6 sm:p-8 text-white shadow-2xl border-0">
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10 flex flex-col items-center space-y-6 text-center">
          <div className="animate-bounce">
            <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-pink-300" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">
              ¡Apoya Nuestro Proyecto!
            </h2>
            <p className="text-base sm:text-lg font-medium text-pink-200">
              Realiza tu donación a través de Nequi
            </p>
          </div>

          <div className="w-full flex justify-center">
            <div className="relative">
              <img 
                src={NequiQR} 
                alt="Código QR de Nequi" 
                className="w-48 h-48 sm:w-64 sm:h-64 rounded-xl shadow-lg" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm sm:text-base text-pink-200">
              Tu apoyo nos ayuda a seguir creciendo 💜
            </p>
            <p className="text-xs text-pink-100">
              Escanea el código QR con la app de Nequi
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
