import { Heart, Phone, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";

export default function DonationBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const phoneNumber = "3204051366";

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleCopyNumber = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      alert("¡Número copiado al portapapeles!");
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  return (
    <div
      className={`transition-all duration-1000 transform ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <Card className="relative overflow-hidden bg-gradient-to-r from-[#2C0054] to-[#FF0099] p-6 text-white shadow-xl">
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -left-20 -bottom-20 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10 flex flex-col items-center space-y-4 text-center">
          <div className="animate-bounce">
            <Heart className="h-12 w-12 text-pink-300" />
          </div>

          <h2 className="text-2xl font-bold md:text-3xl">
            ¡Apoya Nuestro Proyecto!
          </h2>

          <div className="space-y-2">
            <p className="text-lg font-medium text-pink-200">
              Realiza tu donación a través de Nequi
            </p>
            <div className="flex items-center justify-center space-x-2 text-xl font-bold">
              <Phone className="h-5 w-5" />
              <span className="animate-pulse">{phoneNumber}</span>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Button
              onClick={handleCopyNumber}
              className="bg-white font-semibold text-[#2C0054] hover:bg-pink-100"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Copiar Número
            </Button>
          </div>

          <p className="text-sm text-pink-200">
            Tu apoyo nos ayuda a seguir creciendo 💜
          </p>
        </div>
      </Card>
    </div>
  );
}
