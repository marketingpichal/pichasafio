import { useState, useEffect, useCallback } from "react";
import {
  MessageCircle,
  X,
  Users,
  Clock,
  Zap,
  CheckCircle2,
  Flame,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PHONE_NUMBER = "573046286547";

const BENEFITS = [
  "Plan hecho a tu medida (no genérico de internet)",
  "Seguimiento semanal por WhatsApp",
  "Ajustes en tiempo real según tu progreso",
  "Acceso a rutinas exclusivas no publicadas",
];

export default function CoachingBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [spotsLeft, setSpotsLeft] = useState(4);
  const [secondsLeft, setSecondsLeft] = useState(600); // 10 min countdown

  // Show IMMEDIATELY — this is the first thing they see after T&C
  useEffect(() => {
    // tiny delay just to let the page paint first
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Countdown timer (urgency)
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isVisible]);

  // Spots decreasing (scarcity)
  useEffect(() => {
    if (!isVisible) return;
    const interval = setInterval(() => {
      setSpotsLeft((prev) => (prev > 1 ? prev - 1 : 1));
    }, 35000);
    return () => clearInterval(interval);
  }, [isVisible]);

  const handleWhatsAppClick = useCallback(() => {
    const message = `Hola vengo por la asesoria de pichasafio`;
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }, []);

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsVisible(false);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="relative w-full max-w-2xl bg-stone-950 border-2 border-red-600 rounded-2xl sm:rounded-3xl shadow-2xl shadow-red-900/20 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top urgency bar */}
            <div className="bg-red-600 text-white text-center py-2 px-4 text-xs sm:text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2">
              <Flame className="w-4 h-4" />
              Oferta exclusiva para nuevos miembros
              <Flame className="w-4 h-4" />
            </div>

            {/* Close */}
            <button
              onClick={handleClose}
              className="absolute top-10 right-3 sm:top-11 sm:right-4 z-10 p-2 bg-stone-900/80 hover:bg-stone-800 rounded-full text-stone-400 hover:text-white transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-10">
              {/* Badge */}
              <div className="flex justify-center mb-5">
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 px-4 py-1.5 rounded-full">
                  <Zap className="w-4 h-4" />
                  Asesoría 1 a 1 con experto
                </span>
              </div>

              {/* Headline — Pattern interrupt + loss aversion */}
              <h2 className="text-3xl sm:text-5xl font-black text-center text-white uppercase tracking-tight leading-tight mb-4">
                La información gratis{" "}
                <span className="text-red-500">no te transforma.</span>
                <br className="hidden sm:block" /> Un plan personalizado{" "}
                <span className="text-green-400">sí.</span>
              </h2>

              {/* Subheadline */}
              <p className="text-center text-stone-400 text-base sm:text-lg max-w-lg mx-auto mb-8">
                Llevas meses leyendo, probando rutinas de internet y viendo
                resultados mediocres. Lo que necesitas no es más información.
                Necesitas a alguien que diseñe tu camino paso a paso.
              </p>

              {/* Social proof strip */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mb-8 text-sm text-stone-400">
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-red-500" />
                  <span>
                    <strong className="text-white">+200</strong> hombres
                    asesorados
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>
                    <strong className="text-white">93%</strong> ven resultados
                    en 30 días
                  </span>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-5 sm:p-6 mb-8">
                <p className="text-center text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-300 mb-4">
                  Esto es lo que recibes:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BENEFITS.map((b, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2.5 text-sm text-stone-300"
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Scarcity + countdown */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mb-8">
                <div className="flex items-center gap-2 bg-red-600/10 border border-red-600/30 px-4 py-2 rounded-lg">
                  <Clock className="w-4 h-4 text-red-500" />
                  <span className="text-red-400 font-mono font-bold text-lg tracking-wider">
                    {formattedTime}
                  </span>
                </div>
                <div className="text-sm text-stone-400">
                  Solo quedan{" "}
                  <span className="text-red-400 font-bold">{spotsLeft}</span>{" "}
                  cupos disponibles
                </div>
              </div>

              {/* Main CTA */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleWhatsAppClick}
                className="w-full bg-green-600 hover:bg-green-500 text-white text-lg sm:text-xl font-black uppercase tracking-widest py-4 sm:py-5 px-6 rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-green-900/30 transition-colors"
              >
                <MessageCircle className="w-6 h-6" />
                Quiero mi asesoría personalizada
                <ArrowRight className="w-5 h-5" />
              </motion.button>

              {/* Secondary reassurance */}
              <p className="text-center text-xs text-stone-500 mt-4">
                Sin compromiso. Solo recibirás información. Si no es para ti,
                cierras el chat y listo.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
