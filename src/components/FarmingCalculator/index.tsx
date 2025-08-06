import { useState } from "react";
import { motion } from "framer-motion";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import ResponsiveCard from "../common/ResponsiveCard";
import ResponsiveButton from "../common/ResponsiveButton";
import LeaderboardTable from "@/components/LeaderboardTable";
import {
  Calculator,
  Target,
  TrendingUp,
  Award,
  Clock,
  AlertTriangle,
  CheckCircle,
  Trophy,
  History,
} from "lucide-react";

const FarmingCalculator = () => {
  const categorias = [
    {
      value: "gorda",
      text: "Gorda",
      xp: 40,
      color: "from-red-500 to-pink-500",
      icon: "🎯",
    },
    {
      value: "fea",
      text: "Fea",
      xp: 20,
      color: "from-gray-500 to-gray-600",
      icon: "😐",
    },
    {
      value: "extranjera",
      text: "Extranjera",
      xp: 40,
      color: "from-blue-500 to-cyan-500",
      icon: "🌍",
    },
    {
      value: "novia",
      text: "Novia",
      xp: 1000,
      color: "from-pink-500 to-rose-500",
      icon: "💕",
    },
    {
      value: "amiga",
      text: "Amiga",
      xp: 10,
      color: "from-green-500 to-emerald-500",
      icon: "👭",
    },
    {
      value: "normal",
      text: "Normal",
      xp: 10,
      color: "from-blue-500 to-purple-500",
      icon: "👤",
    },
    {
      value: "buena",
      text: "Buena",
      xp: 5,
      color: "from-yellow-500 to-orange-500",
      icon: "👍",
    },
    {
      value: "top",
      text: "Top",
      xp: 200,
      color: "from-purple-500 to-pink-500",
      icon: "🏆",
    },
  ];

  const penalizaciones = [
    {
      value: "none",
      text: "Sin penalización",
      factor: 1,
      color: "from-green-500 to-emerald-500",
      icon: "✅",
    },
    {
      value: "leve",
      text: "Leve",
      factor: 0.5,
      color: "from-yellow-500 to-orange-500",
      icon: "⚠️",
    },
    {
      value: "media",
      text: "Media",
      factor: 0.25,
      color: "from-orange-500 to-red-500",
      icon: "🚨",
    },
    {
      value: "grave",
      text: "Grave",
      factor: 0,
      color: "from-red-500 to-pink-500",
      icon: "💀",
    },
    {
      value: "ban",
      text: "Ban",
      factor: 0,
      color: "from-gray-500 to-gray-600",
      icon: "🚫",
    },
  ];

  const supabase = useSupabaseClient();
  const user = useUser();
  const [dailyCount, setDailyCount] = useState(0);
  const [canSubmit, setCanSubmit] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [categoria, setCategoria] = useState("gorda");
  const [penalizacion, setPenalizacion] = useState("none");
  const [xpAcumulada, setXpAcumulada] = useState(0);
  const [historial, setHistorial] = useState<string[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastXpGained, setLastXpGained] = useState(0);

  const calcularXP = async () => {
    if (!user?.id || !canSubmit || isLoading) return;

    setIsLoading(true);
    const categoriaSeleccionada = categorias.find(
      (cat) => cat.value === categoria
    );
    const penalizacionSeleccionada = penalizaciones.find(
      (pen) => pen.value === penalizacion
    );

    if (!categoriaSeleccionada || !penalizacionSeleccionada) return;

    if (penalizacion === "ban") {
      setHistorial((prev) => [
        `🚫 ¡Baneado del servidor! ${new Date().toLocaleTimeString()}`,
        ...prev,
      ]);
      setIsLoading(false);
      return;
    }

    const xpBase = categoriaSeleccionada.xp;
    const factor = penalizacionSeleccionada.factor;
    const xpGanada = xpBase * factor;

    try {
      const { data: existingUser, error: userError } = await supabase
        .from("leaderboard")
        .select("points, level")
        .eq("profileId", user.id)
        .single();

      if (userError && userError.code !== "PGRST116") {
        throw userError;
      }

      const currentPoints = existingUser?.points || 0;
      const newPoints = currentPoints + xpGanada;
      const newLevel = Math.floor(newPoints / 1000) + 1;

      if (existingUser) {
        await supabase
          .from("leaderboard")
          .update({
            points: newPoints,
            level: newLevel,
            last_activity: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("profileId", user.id);
      } else {
        await supabase.from("leaderboard").insert({
          profileId: user.id,
          points: xpGanada,
          level: 1,
          rank: "Novato",
          last_activity: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }

      setXpAcumulada(newPoints);
      setLastXpGained(xpGanada);
      setDailyCount((prev) => prev + 1);
      setCanSubmit((prev) => {
        // Si prev es true (puede enviar), lo convertimos a 1 y sumamos 1, si es false (0), sumamos 1 igualmente.
        // Solo permitimos enviar si el contador es menor que 2.
        // Por claridad, deberíamos usar un contador numérico, pero respetando el estado actual:
        // Si prev es booleano, lo convertimos a número.
        const count = typeof prev === "boolean" ? (prev ? 1 : 0) : prev;
        return count + 1 < 2;
      });
      setShowSuccess(true);
      setHistorial((prev) => [
        `${categoriaSeleccionada.icon} ${categoriaSeleccionada.text} con ${
          penalizacionSeleccionada.icon
        } ${
          penalizacionSeleccionada.text
        }: +${xpGanada} XP - Total: ${newPoints} XP - ${new Date().toLocaleTimeString()}`,
        ...prev,
      ]);

      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving to Supabase:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoriaSeleccionada = () =>
    categorias.find((cat) => cat.value === categoria);
  const getPenalizacionSeleccionada = () =>
    penalizaciones.find((pen) => pen.value === penalizacion);

  const xpCalculada = () => {
    const cat = getCategoriaSeleccionada();
    const pen = getPenalizacionSeleccionada();
    return cat && pen ? cat.xp * pen.factor : 0;
  };

  return (
    <div className="min-h-screen bg-gray-900 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
              <Calculator className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text-extended mb-4 font-poppins">
            Calculadora de Farmeo
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed font-poppins-light">
            Calcula tu XP y sube en el ranking. Gana puntos por tus
            interacciones y compite con otros usuarios.
          </p>
        </motion.div>

        {/* Success Notification */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-xl shadow-xl flex items-center space-x-3">
              <CheckCircle className="w-6 h-6" />
              <div>
                <p className="font-semibold font-poppins-semibold">
                  ¡XP Ganada!
                </p>
                <p className="text-sm font-poppins-light">
                  +{lastXpGained} XP agregada a tu cuenta
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Calculator */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <ResponsiveCard
            title="Calculadora XP"
            subtitle="Selecciona la categoría y penalización para calcular tu XP"
          >
            <div className="space-y-6">
              {/* Category Selection */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Target className="w-6 h-6 text-blue-400" />
                  <h3 className="text-lg font-semibold text-white font-poppins-semibold">
                    Categoría
                  </h3>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {categorias.map((cat) => (
                    <motion.button
                      key={cat.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCategoria(cat.value)}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 font-poppins-medium ${
                        categoria === cat.value
                          ? `border-blue-500 bg-gradient-to-r ${cat.color} text-white`
                          : "border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500"
                      }`}
                    >
                      <div className="text-2xl mb-2">{cat.icon}</div>
                      <div className="text-sm font-semibold">{cat.text}</div>
                      <div className="text-xs opacity-75">{cat.xp} XP</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Penalty Selection */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-400" />
                  <h3 className="text-lg font-semibold text-white font-poppins-semibold">
                    Penalización
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                  {penalizaciones.map((pen) => (
                    <motion.button
                      key={pen.value}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setPenalizacion(pen.value)}
                      className={`p-3 rounded-xl border-2 transition-all duration-200 font-poppins-medium ${
                        penalizacion === pen.value
                          ? `border-red-500 bg-gradient-to-r ${pen.color} text-white`
                          : "border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500"
                      }`}
                    >
                      <div className="text-lg mb-1">{pen.icon}</div>
                      <div className="text-xs font-semibold">{pen.text}</div>
                      <div className="text-xs opacity-75">x{pen.factor}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* XP Preview */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white font-poppins-semibold">
                      XP Calculada
                    </h3>
                    <p className="text-gray-300 text-sm font-poppins-light">
                      {getCategoriaSeleccionada()?.text} ×{" "}
                      {getPenalizacionSeleccionada()?.text}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-yellow-400 font-poppins-bold">
                      +{xpCalculada()}
                    </div>
                    <div className="text-sm text-gray-300 font-poppins-light">
                      XP
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center">
                <ResponsiveButton
                  onClick={calcularXP}
                  disabled={!canSubmit || isLoading}
                  size="lg"
                  className="w-full max-w-md"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Calculando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Calculator className="w-5 h-5" />
                      <span>Calcular XP</span>
                    </div>
                  )}
                </ResponsiveButton>
              </div>

              {/* Daily Limit Warning */}
              {!canSubmit && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4"
                >
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-yellow-400" />
                    <div>
                      <p className="text-yellow-400 font-semibold font-poppins-semibold">
                        Límite Diario Alcanzado
                      </p>
                      <p className="text-gray-300 text-sm font-poppins-light">
                        Has alcanzado el límite de 2 registros diarios. ¡Vuelve
                        mañana!
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ResponsiveCard>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <ResponsiveCard className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 font-poppins-bold">
              {xpAcumulada}
            </h3>
            <p className="text-gray-300 text-sm font-poppins-light">
              XP Acumulada
            </p>
          </ResponsiveCard>

          <ResponsiveCard className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Trophy className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 font-poppins-bold">
              {dailyCount}/2
            </h3>
            <p className="text-gray-300 text-sm font-poppins-light">
              Registros Hoy
            </p>
          </ResponsiveCard>

          <ResponsiveCard className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-white mb-2 font-poppins-bold">
              {Math.floor(xpAcumulada / 1000) + 1}
            </h3>
            <p className="text-gray-300 text-sm font-poppins-light">
              Nivel Actual
            </p>
          </ResponsiveCard>
        </motion.div>

        {/* History */}
        {historial.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-8"
          >
            <ResponsiveCard
              title="Historial de Actividad"
              subtitle="Tus últimas acciones y XP ganada"
            >
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {historial.map((entrada, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg"
                  >
                    <History className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <p className="text-sm text-gray-300 font-poppins-light">
                      {entrada}
                    </p>
                  </motion.div>
                ))}
              </div>
            </ResponsiveCard>
          </motion.div>
        )}

        {/* Leaderboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <LeaderboardTable />
        </motion.div>
      </div>
    </div>
  );
};

export default FarmingCalculator;
