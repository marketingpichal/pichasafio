import React from "react";
import { logAdEvent } from "@/lib/adTracking";
import { useAuth } from "@/context/AuthProvider";
import { motion } from "framer-motion";
import ResponsiveCard from "../common/ResponsiveCard";
import { supabase } from "@/lib/supabaseClient";
import {
  challengeService,
  type UserChallenge,
  type DailyProgress,
} from "@/lib/challengeService";
import {
  Calendar,
  Play,
  Target,
  Trophy,
  Lock,
  CheckCircle,
  Star,
  Flame,
} from "lucide-react";

// Interfaz para la función de notificación
interface AchievementNotification {
  type: "achievement" | "streak" | "level" | "challenge";
  title: string;
  message: string;
  icon: string;
  points?: number;
}

declare global {
  interface Window {
    showAchievementNotification?: (
      notification: AchievementNotification
    ) => void;
  }
}

interface Exercise {
  name: string;
  url: string;
  description?: string;
  embedUrl?: string;
}

interface DayProps {
  day: number;
  exercise: Exercise;
  onClick: (day: number) => void;
  isActive?: boolean;
  isUnlocked?: boolean;
  isCompleted?: boolean;
}

const exercises: Exercise[] = [
  {
    name: "Dry Jelq",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/dry-jelq.webm?view=1",
    description: "Ejercicio básico de jelqing seco",
  },
  {
    name: "Jelq Squeeze",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/jelq-squeeze.webm?view=1",
    description: "Jelqing con técnica de squeeze",
  },
  {
    name: "ULI Basic",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/uli3.webm?view=1",
    description: "Ejercicio ULI básico",
  },
  {
    name: "Extreme ULI",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/extreme-uli.webm?view=1",
    description: "Versión avanzada del ULI",
  },
  {
    name: "Plumped Bend",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/plumped-bend.webm?view=1",
    description: "Ejercicio de flexión",
  },
  {
    name: "Sadsak Slinky",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/sadsak-slinky.webm?view=1",
    description: "Técnica Sadsak Slinky",
  },
  {
    name: "Manual Stretches",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/simple-manual-stretches.webm?view=1",
    description: "Estiramientos manuales básicos",
  },
  {
    name: "BTC Stretch",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/btc-stretch.webm?view=1",
    description: "Estiramiento BTC",
  },
  {
    name: "JAI Stretch",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/jai-stretch.webm?view=1",
    description: "Estiramiento JAI",
  },
  {
    name: "V-Stretch",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/v-stretch.webm?view=1",
    description: "Estiramiento en V",
  },
  {
    name: "Inverted V-Stretch",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/inverted-v-a-stretch.webm?view=1",
    description: "Estiramiento en V invertida",
  },
];

const Day: React.FC<DayProps> = ({
  day,
  exercise,
  onClick,
  isActive,
  isUnlocked = true,
  isCompleted = false,
}) => {
  const getDayStyles = () => {
    if (isCompleted) {
      return "border-red-600 bg-red-600/20 text-red-500 shadow-lg shadow-red-900/20";
    }
    if (isActive) {
      return "border-amber-500 bg-amber-500/20 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]";
    }
    if (!isUnlocked) {
      return "border-stone-800 bg-stone-900 text-stone-600 cursor-not-allowed opacity-50";
    }
    return "border-stone-700 bg-stone-800 hover:border-red-500 hover:bg-stone-700 text-gray-300 hover:text-white transition-colors duration-200";
  };

  const handleClick = () => {
    if (!isUnlocked) return;
    onClick(day);
  };

  return (
    <motion.div
      whileHover={isUnlocked ? { scale: 1.02 } : {}}
      whileTap={isUnlocked ? { scale: 0.97 } : {}}
      onClick={handleClick}
      className={`p-4 border-2 rounded-xl text-center relative ${isUnlocked ? "cursor-pointer" : "cursor-not-allowed"
        } ${getDayStyles()}`}
      role="button"
      aria-label={`Ejercicio del día ${day}: ${exercise.name}`}
      tabIndex={isUnlocked ? 0 : -1}
    >
      <header>
        <h3 className="font-bold text-lg mb-1">Día {day}</h3>
      </header>
      <p className="text-xs sm:text-sm opacity-90">{exercise.name}</p>

      {!isUnlocked && (
        <div className="absolute top-2 right-2">
          <Lock className="w-4 h-4" />
        </div>
      )}

      {isCompleted && (
        <div className="absolute top-2 right-2">
          <CheckCircle className="w-4 h-4" />
        </div>
      )}
    </motion.div>
  );
};

const ThirtyDayChallenge: React.FC = () => {
  const totalDays = 30;
  const [currentVideo, setCurrentVideo] = React.useState<string>("");
  const [currentExercise, setCurrentExercise] = React.useState<Exercise | null>(
    null
  );
  const [showVideo, setShowVideo] = React.useState<boolean>(false);
  const [selectedDay, setSelectedDay] = React.useState<number | null>(null);
  const pendingRef = React.useRef<{ day: number; exercise: Exercise } | null>(
    null
  );
  const { user } = useAuth();

  // Estados para el progreso del reto
  const [userChallenge, setUserChallenge] =
    React.useState<UserChallenge | null>(null);
  const [userProgress, setUserProgress] = React.useState<DailyProgress[]>([]);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);

  // Cargar progreso del usuario
  React.useEffect(() => {
    const loadUserProgress = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        setError(null);

        // Obtener o crear el reto del usuario
        const challenge = await challengeService.getOrCreateUserChallenge(
          user.id,
          "30_days"
        );

        // Obtener el progreso
        const { data: progress, error } = await supabase
          .from("daily_progress")
          .select("*")
          .eq("challenge_id", challenge.id)
          .order("day_number", { ascending: true });

        if (error) {
          throw error;
        }

        setUserChallenge(challenge);
        setUserProgress(progress || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Error al cargar el progreso"
        );
        console.error("Error loading user progress:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserProgress();
  }, [user?.id]);

  const getExerciseForDay = (day: number): Exercise => {
    const exerciseIndex = (day - 1) % exercises.length;
    return exercises[exerciseIndex];
  };

  // Verificar si un día está desbloqueado
  const isDayUnlocked = (): boolean => {
    // Todos los días están desbloqueados para permitir acceso libre
    return true;
  };

  // Verificar si un día está completado
  const isDayCompleted = (day: number): boolean => {
    return userProgress.some((progress) => progress.day_number === day);
  };

  const shouldGateForDay = (): boolean => {
    // Anuncios deshabilitados: nunca requerir anuncio para desbloquear el video
    return false;
  };

  const unlockVideo = (day: number, exercise: Exercise) => {
    setCurrentExercise(exercise);
    setCurrentVideo(exercise.embedUrl || exercise.url);
    setShowVideo(true);
    setSelectedDay(day);
  };

  const completeDay = async (
    day: number,
    exercise: Exercise,
    adWatched: boolean = false
  ) => {
    if (!user?.id) return;

    try {
      await challengeService.completeDay(
        user.id,
        "30_days",
        day,
        exercise.name,
        adWatched
      );

      // Recargar progreso
      const challenge = await challengeService.getOrCreateUserChallenge(
        user.id,
        "30_days"
      );

      const { data: progress, error } = await supabase
        .from("daily_progress")
        .select("*")
        .eq("challenge_id", challenge.id)
        .order("day_number", { ascending: true });

      if (error) {
        throw error;
      }

      setUserChallenge(challenge);
      setUserProgress(progress || []);

      // Mostrar notificación de logro
      if (window.showAchievementNotification) {
        window.showAchievementNotification({
          type: "challenge",
          title: "¡Día Completado!",
          message: `Has completado el día ${day}: ${exercise.name}`,
          icon: "✅",
          points: 15,
        });
      }

      unlockVideo(day, exercise);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al completar el día"
      );
      console.error("Error completing day:", err);
    }
  };

  const handleDayClick = async (day: number) => {
    if (!user?.id) return;

    const exercise = getExerciseForDay(day);

    // Verificar si el día está desbloqueado
    if (!isDayUnlocked()) {
      setError(
        "Este día aún no está desbloqueado. Completa los días anteriores primero."
      );
      return;
    }

    // Verificar si ya está completado
    if (isDayCompleted(day)) {
      unlockVideo(day, exercise);
      return;
    }

    if (shouldGateForDay()) {
      pendingRef.current = { day, exercise };
      logAdEvent("gate_required", {
        user_id: user?.id ?? null,
        provider: "juicyads",
        ad_zone:
          window.matchMedia && window.matchMedia("(max-width: 768px)").matches
            ? "1098249"
            : "1098247",
        context: { day, exerciseName: exercise.name },
      }).catch(() => void 0);
      return;
    }

    await completeDay(day, exercise, false);
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
            <div className="w-20 h-20 bg-stone-900 border border-red-500/30 rounded-full flex items-center justify-center shadow-lg shadow-red-900/20">
              <Trophy className="w-10 h-10 text-red-500" />
            </div>
          </div>
          <h1 className="challenge-heading text-4xl sm:text-5xl md:text-6xl mb-4 text-white drop-shadow-md">
            DESAFÍO DE 30 DÍAS
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed mb-6">
            Este no es un reto más. Es un compromiso diario con tu rendimiento. Falla un día y pierdes el ritmo.
          </p>
          <div className="inline-flex items-center bg-stone-800/80 border border-stone-700 px-4 py-2 rounded-full text-sm font-poppins-medium text-gray-300">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            8,432 hombres están completando este desafío hoy.
          </div>
        </motion.div>

        {/* Progress Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <ResponsiveCard className="text-center bg-stone-900 border-stone-800">
            <div className="flex justify-center mb-4">
              <Calendar className="w-8 h-8 text-stone-500" />
            </div>
            <h3 className="text-3xl font-mono font-bold text-white mb-2">30</h3>
            <p className="text-gray-400 text-sm font-poppins-semibold uppercase tracking-wider">Días Totales</p>
          </ResponsiveCard>

          <ResponsiveCard className="text-center bg-stone-900 border-stone-800">
            <div className="flex justify-center mb-4">
              <Target className="w-8 h-8 text-amber-500" />
            </div>
            <h3 className="text-3xl font-mono font-bold text-amber-500 mb-2">11</h3>
            <p className="text-gray-400 text-sm font-poppins-semibold uppercase tracking-wider">Técnicas Clave</p>
          </ResponsiveCard>

          <ResponsiveCard className="text-center bg-stone-900 border-stone-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-red-600/5 z-0"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-4">
                <Flame className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-red-500 mb-2">PELIGRO</h3>
              <p className="text-gray-400 text-sm font-poppins-medium">Perderás tu racha si saltas un día.</p>
            </div>
          </ResponsiveCard>
        </motion.div>

        {/* Calendar Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <ResponsiveCard
            title="Calendario de Entrenamiento"
            subtitle="Haz clic en cualquier día para ver el ejercicio correspondiente"
          >
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="text-red-400 mb-4">
                  <Star className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-red-400 font-semibold">{error}</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Estadísticas del Programa */}
                {userChallenge && (
                  <div className="bg-stone-900 border border-stone-800 rounded-xl p-6 mb-6">
                    <h3 className="text-xl font-bold text-white mb-4 flex flex-col sm:flex-row sm:items-center font-poppins-semibold uppercase tracking-wide gap-2">
                      <div className="flex items-center">
                        <Flame className="w-6 h-6 mr-2 text-red-500" />
                        Tu Progreso
                      </div>
                      {totalDays - userChallenge.completed_days > 0 && (
                        <span className="sm:ml-auto text-sm text-amber-500/80 lowercase font-normal">
                          Faltan {totalDays - userChallenge.completed_days} días para terminar el desafío
                        </span>
                      )}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center bg-stone-800/50 p-4 rounded-lg">
                        <p className="text-3xl font-mono font-bold text-white mb-1">
                          {userChallenge.completed_days}
                        </p>
                        <p className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wider">
                          Días Superados
                        </p>
                      </div>
                      <div className="text-center bg-stone-800/50 p-4 rounded-lg border-b-2 border-amber-500 relative">
                        {userChallenge.streak_days > 2 && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest whitespace-nowrap">
                            ¡Racha Activa!
                          </div>
                        )}
                        <p className="text-3xl font-mono font-bold text-amber-500 mb-1">
                          {userChallenge.streak_days}
                        </p>
                        <p className="text-amber-500/80 text-xs font-poppins-semibold uppercase tracking-wider">
                          Racha Actual
                        </p>
                      </div>
                      <div className="text-center bg-stone-800/50 p-4 rounded-lg">
                        <p className="text-3xl font-mono font-bold text-gray-300 mb-1">
                          {Math.round(
                            (userChallenge.completed_days / totalDays) * 100
                          )}%
                        </p>
                        <p className="text-gray-400 text-xs font-poppins-semibold uppercase tracking-wider">Completado</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-3 sm:gap-4">
                  {Array.from({ length: totalDays }, (_, i) => i + 1).map(
                    (day) => (
                      <Day
                        key={day}
                        day={day}
                        exercise={getExerciseForDay(day)}
                        onClick={handleDayClick}
                        isActive={selectedDay === day}
                        isUnlocked={isDayUnlocked()}
                        isCompleted={isDayCompleted(day)}
                      />
                    )
                  )}
                </div>
              </div>
            )}
          </ResponsiveCard>
        </motion.div>

        {/* Video Section */}
        {showVideo && currentExercise && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-12"
          >
            <ResponsiveCard
              title={`Día ${selectedDay}: ${currentExercise.name}`}
              subtitle={currentExercise.description}
            >
              <div className="space-y-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">
                    Ejercicio del Día {selectedDay}
                  </h3>
                </div>

                <div className="flex justify-center">
                  <div className="w-full max-w-4xl">
                    {currentExercise.embedUrl ? (
                      <iframe
                        src={currentExercise.embedUrl}
                        frameBorder={0}
                        marginWidth={0}
                        marginHeight={0}
                        scrolling="no"
                        width="100%"
                        height="400"
                        allowFullScreen
                        className="rounded-xl shadow-lg"
                      />
                    ) : (
                      <video
                        controls
                        src={currentVideo}
                        className="w-full rounded-xl shadow-lg"
                        style={{ maxHeight: "400px" }}
                      />
                    )}
                  </div>
                </div>

                <div className="bg-gray-800/50 rounded-xl p-4">
                  <h4 className="font-semibold text-white mb-2">
                    Instrucciones:
                  </h4>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {currentExercise.description ||
                      "Sigue las instrucciones del video cuidadosamente. Realiza el ejercicio de manera controlada y respeta los tiempos de descanso."}
                  </p>
                </div>
              </div>
            </ResponsiveCard>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-6"
        >
          <div className="bg-stone-900 border border-stone-800 p-8 sm:p-10 max-w-2xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-poppins-extrabold uppercase tracking-tighter text-white mb-2">
                ¿A QUÉ ESPERAS?
              </h3>
              <p className="text-gray-400 leading-relaxed font-poppins-medium">
                La constancia separa a los que hablan de los que hacen. Elige tu día y empieza el contador.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleDayClick(1)}
                  className="bg-red-600 text-white px-8 py-4 font-poppins-bold uppercase tracking-widest text-sm hover:bg-red-700 transition-colors shadow-lg shadow-red-900/50"
                >
                  ARRANCAR DÍA 1
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-transparent border border-stone-700 text-gray-300 px-8 py-4 font-poppins-bold uppercase tracking-widest text-sm hover:bg-stone-800 hover:text-white transition-colors"
                >
                  VER PROGRESO
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ThirtyDayChallenge;
