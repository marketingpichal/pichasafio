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
  DollarSign,
  Star,
  Lock,
  Copy,
  Check,
  Wallet,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const PHONE_NUMBER = "573046286547";
const NEQUI_NUMBER = "3204051366";

const BENEFITS = [
  "Plan hecho a tu medida (no genérico de internet)",
  "Seguimiento semanal por WhatsApp",
  "Ajustes en tiempo real según tu progreso",
  "Acceso a rutinas exclusivas no publicadas",
  "Asesor humano disponible todos los días",
  "Grupo exclusivo con contenido solo para suscriptores",
];

export default function CoachingBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [spotsLeft, setSpotsLeft] = useState(4);
  const [secondsLeft, setSecondsLeft] = useState(600); // 10 min countdown
  const [step, setStep] = useState<"pitch" | "payment">("pitch");
  const [copied, setCopied] = useState(false);

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

  const handlePaymentWhatsAppClick = useCallback(() => {
    const message = `Hola, acabo de pagar $50.000 por la asesoría de Pichasafio por Nequi al número ${NEQUI_NUMBER}. Adjunto comprobante de pago.`;
    const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  }, []);

  const handleCopyNequi = async () => {
    try {
      await navigator.clipboard.writeText(NEQUI_NUMBER);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

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
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-[99999] flex items-start justify-center sm:items-center p-4 sm:p-6 overflow-y-auto"
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
              className="absolute top-3 right-3 sm:top-11 sm:right-4 z-10 p-3 bg-stone-900/90 hover:bg-stone-800 rounded-full text-stone-400 hover:text-white transition-colors touch-manipulation"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6 sm:w-5 sm:h-5" />
            </button>

            <div className="p-6 sm:p-10">
              {step === "pitch" ? (
                <>
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

                  {/* Pricing */}
                  <div className="bg-stone-900/60 border border-stone-800 rounded-xl p-5 sm:p-6 mb-8">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <DollarSign className="w-5 h-5 text-amber-400" />
                      <p className="text-center text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-300">
                        Inversión en tu transformación
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                      <div className="flex items-center gap-3 bg-green-600/10 border border-green-600/30 px-5 py-3 rounded-lg">
                        <Star className="w-5 h-5 text-green-400" />
                        <div className="text-center sm:text-left">
                          <p className="text-xs text-green-400 font-bold uppercase">Primeros 10 cupos</p>
                          <p className="text-2xl font-black text-white">$50.000<span className="text-sm font-medium text-stone-400">/mes</span></p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-stone-800/60 border border-stone-700 px-5 py-3 rounded-lg">
                        <Lock className="w-5 h-5 text-stone-400" />
                        <div className="text-center sm:text-left">
                          <p className="text-xs text-stone-400 font-bold uppercase">Resto de cupos</p>
                          <p className="text-2xl font-black text-stone-300">$100.000<span className="text-sm font-medium text-stone-500">/mes</span></p>
                        </div>
                      </div>
                    </div>
                    <p className="text-center text-xs text-stone-500 mt-3">
                      Precio en pesos colombianos. Cancela cuando quieras.
                    </p>
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

                  {/* Main CTA — leads to payment step */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep("payment")}
                    className="w-full bg-green-600 hover:bg-green-500 text-white text-lg sm:text-xl font-black uppercase tracking-widest py-4 sm:py-5 px-6 rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-green-900/30 transition-colors"
                  >
                    <Wallet className="w-6 h-6" />
                    Sí, quiero pagar mi cupo — $50.000
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>

                  {/* Filter copy */}
                  <p className="text-center text-xs text-stone-500 mt-4">
                    Solo para personas decididas. Si aún no estás listo para invertir en ti, cierra esta ventana.
                  </p>
                </>
              ) : (
                <>
                  {/* Payment Step */}
                  <div className="flex justify-center mb-5">
                    <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-green-400 bg-green-400/10 border border-green-400/20 px-4 py-1.5 rounded-full">
                      <Wallet className="w-4 h-4" />
                      Paso final — Paga y envía comprobante
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-4xl font-black text-center text-white uppercase tracking-tight leading-tight mb-3">
                    No perdamos tiempo.
                  </h2>
                  <p className="text-center text-red-400 text-sm sm:text-base font-bold uppercase tracking-wide mb-6">
                    Paga por Nequi y mándame el comprobante por WhatsApp.
                  </p>

                  {/* Nequi Payment Box */}
                  <div className="bg-stone-900/80 border-2 border-green-600/40 rounded-xl p-6 sm:p-8 mb-6">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <DollarSign className="w-5 h-5 text-green-400" />
                      <p className="text-center text-sm font-bold uppercase tracking-wider text-stone-300">
                        Paga aquí por Nequi
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-3 mb-4">
                      <div className="text-4xl sm:text-5xl font-black text-white tracking-wider">
                        {NEQUI_NUMBER}
                      </div>
                      <button
                        onClick={handleCopyNequi}
                        className="p-2.5 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded-lg text-stone-300 hover:text-white transition-colors"
                        aria-label="Copiar número de Nequi"
                        title="Copiar número"
                      >
                        {copied ? (
                          <Check className="w-5 h-5 text-green-400" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </button>
                    </div>

                    <p className="text-center text-xs text-stone-500 mb-4">
                      {copied ? "¡Número copiado! Abre Nequi y pega aquí." : "Toca el botón para copiar y pega en Nequi."}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <div className="text-center">
                        <p className="text-xs text-green-400 font-bold uppercase">Primeros 10 cupos</p>
                        <p className="text-3xl font-black text-white">$50.000</p>
                      </div>
                      <div className="hidden sm:block w-px h-10 bg-stone-700" />
                      <div className="text-center">
                        <p className="text-xs text-stone-500 font-bold uppercase">Después</p>
                        <p className="text-2xl font-black text-stone-400">$100.000</p>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp CTA for receipt */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePaymentWhatsAppClick}
                    className="w-full bg-green-600 hover:bg-green-500 text-white text-lg sm:text-xl font-black uppercase tracking-widest py-4 sm:py-5 px-6 rounded-xl flex items-center justify-center gap-3 shadow-xl shadow-green-900/30 transition-colors mb-4"
                  >
                    <MessageCircle className="w-6 h-6" />
                    Ya pagué — Enviar comprobante
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>

                  {/* Back button */}
                  <button
                    onClick={() => setStep("pitch")}
                    className="w-full text-center text-sm text-stone-500 hover:text-stone-300 transition-colors py-2"
                  >
                    ← Volver al inicio
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
