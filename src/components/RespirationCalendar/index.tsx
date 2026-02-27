import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useSound from 'use-sound';
import { useUser } from "@supabase/auth-helpers-react";
import ResponsiveCard from "../common/ResponsiveCard";
import { challengeService } from "@/lib/challengeService";
import {
  Clock,
  Target,
  TrendingUp,
  Play,
  Pause,
  Award,
  Activity,
  Zap,
  Heart,
  Brain,
  Wind
} from "lucide-react";

// Interfaz para la función de notificación
interface AchievementNotification {
  type: 'achievement' | 'streak' | 'level' | 'challenge';
  title: string;
  message: string;
  icon: string;
  points?: number;
}

declare global {
  interface Window {
    showAchievementNotification?: (notification: AchievementNotification) => void;
  }
}

interface Exercise {
  name: string;
  inhaleTime: number;
  holdInTime: number;
  exhaleTime: number;
  holdOutTime: number;
  rounds: number;
  description: string;
  effect: 'BALANCING' | 'CALMING' | 'ENERGIZING';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

interface Stats {
  totalSessions: number;
  totalMinutes: number;
  lastCompleted: Date | null;
}

interface BreathingCircleProps {
  phase: 'inhale' | 'holdIn' | 'exhale' | 'holdOut' | 'rest';
  progress: number;
  timeLeft: number;
}

const exercises: Exercise[] = [
  {
    name: "Pranayama Balanceado 6-0-6-0",
    inhaleTime: 6,
    holdInTime: 0,
    exhaleTime: 6,
    holdOutTime: 0,
    rounds: 25,
    description: "Respiración balanceada para equilibrar la energía",
    effect: "BALANCING",
    difficulty: 'beginner'
  },
  {
    name: "Pranayama Balanceado 8-1-8-1",
    inhaleTime: 8,
    holdInTime: 1,
    exhaleTime: 8,
    holdOutTime: 1,
    rounds: 17,
    description: "Respiración balanceada con retención suave",
    effect: "BALANCING",
    difficulty: 'intermediate'
  },
  {
    name: "Pranayama Calmante 4-0-6-0",
    inhaleTime: 4,
    holdInTime: 0,
    exhaleTime: 6,
    holdOutTime: 0,
    rounds: 30,
    description: "Exhalación prolongada para calmar la mente",
    effect: "CALMING",
    difficulty: 'beginner'
  },
  {
    name: "Pranayama Calmante 4-1-8-4",
    inhaleTime: 4,
    holdInTime: 1,
    exhaleTime: 8,
    holdOutTime: 4,
    rounds: 18,
    description: "Respiración profunda con retención para relajación",
    effect: "CALMING",
    difficulty: 'intermediate'
  },
  {
    name: "Pranayama Energizante 6-0-4-0",
    inhaleTime: 6,
    holdInTime: 0,
    exhaleTime: 4,
    holdOutTime: 0,
    rounds: 30,
    description: "Inhalación prolongada para aumentar la energía",
    effect: "ENERGIZING",
    difficulty: 'beginner'
  },
  {
    name: "Pranayama Energizante 6-4-6-1",
    inhaleTime: 6,
    holdInTime: 4,
    exhaleTime: 6,
    holdOutTime: 1,
    rounds: 18,
    description: "Respiración con retención interna para vitalidad",
    effect: "ENERGIZING",
    difficulty: 'advanced'
  }
];

const BreathingCircle: React.FC<BreathingCircleProps> = ({ phase, progress, timeLeft }) => {
  const size = 200;
  const strokeWidth = 10;

  const circleVariants = {
    inhale: { scale: 1.2, transition: { duration: 0.5 } },
    exhale: { scale: 0.8, transition: { duration: 0.5 } },
    holdIn: { scale: 1.2 },
    holdOut: { scale: 0.8 },
    rest: { scale: 1 }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale': return 'text-red-500';
      case 'holdIn': return 'text-amber-500';
      case 'exhale': return 'text-stone-400';
      case 'holdOut': return 'text-orange-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <motion.div
      className="relative"
      animate={phase}
      variants={circleVariants}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={(size - strokeWidth) / 2}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className={getPhaseColor()}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: progress }}
          transition={{ duration: 0.1 }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-xl font-bold text-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key={phase}
          className="text-center"
        >
          <div className="text-2xl font-poppins-bold mb-2 uppercase tracking-widest text-white">
            {phase === 'inhale' && "Inhala"}
            {phase === 'holdIn' && "Mantén"}
            {phase === 'exhale' && "Exhala"}
            {phase === 'holdOut' && "Mantén"}
            {phase === 'rest' && "Prepárate"}
          </div>
          <div className="text-5xl font-poppins-extrabold text-red-500">{Math.ceil(timeLeft)}s</div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const RespirationCalendar: React.FC = () => {

  const user = useUser();
  const [isExercising, setIsExercising] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'inhale' | 'holdIn' | 'exhale' | 'holdOut' | 'rest'>('rest');
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [progress, setProgress] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedMinutes, setSelectedMinutes] = useState(1);
  const [stats, setStats] = useState<Stats>(() => {
    const saved = localStorage.getItem('breathingStats');
    return saved ? JSON.parse(saved) : {
      totalSessions: 0,
      totalMinutes: 0,
      lastCompleted: null
    };
  });

  const [playTransition] = useSound('/sounds/transition.mp3');
  const [playComplete] = useSound('/sounds/complete.mp3');

  const moveToNextPhase = async () => {
    if (!selectedExercise) return;

    playTransition();
    if ('vibrate' in navigator) {
      navigator.vibrate(200);
    }

    switch (currentPhase) {
      case 'inhale':
        if (selectedExercise.holdInTime > 0) {
          setCurrentPhase('holdIn');
          setTimeLeft(selectedExercise.holdInTime);
        } else {
          setCurrentPhase('exhale');
          setTimeLeft(selectedExercise.exhaleTime);
        }
        break;
      case 'holdIn':
        setCurrentPhase('exhale');
        setTimeLeft(selectedExercise.exhaleTime);
        break;
      case 'exhale':
        if (selectedExercise.holdOutTime > 0) {
          setCurrentPhase('holdOut');
          setTimeLeft(selectedExercise.holdOutTime);
        } else {
          if (currentRound < selectedExercise.rounds) {
            setCurrentRound(prev => prev + 1);
            setCurrentPhase('inhale');
            setTimeLeft(selectedExercise.inhaleTime);
          } else {
            await completeExercise();
          }
        }
        break;
      case 'holdOut':
        if (currentRound < selectedExercise.rounds) {
          setCurrentRound(prev => prev + 1);
          setCurrentPhase('inhale');
          setTimeLeft(selectedExercise.inhaleTime);
        } else {
          await completeExercise();
        }
        break;
      case 'rest':
        setCurrentPhase('inhale');
        setTimeLeft(selectedExercise.inhaleTime);
        break;
    }
    setProgress(0);
  };

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [earnedXP, setEarnedXP] = useState({ base: 0, bonus: 0, total: 0 });
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const [isClaimingXP, setIsClaimingXP] = useState(false);

  const getCurrentPhaseTime = () => {
    if (!selectedExercise) return 0;
    switch (currentPhase) {
      case 'inhale': return selectedExercise.inhaleTime;
      case 'holdIn': return selectedExercise.holdInTime;
      case 'exhale': return selectedExercise.exhaleTime;
      case 'holdOut': return selectedExercise.holdOutTime;
      case 'rest': return 2;
      default: return 0;
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isExercising && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          const newTime = prev - 0.1;
          if (newTime <= 0) {
            clearInterval(timer);
            moveToNextPhase();
            return 0;
          }
          const phaseTime = getCurrentPhaseTime();
          setProgress(1 - (newTime / phaseTime));
          return newTime;
        });
      }, 100);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isExercising, currentPhase, timeLeft]);

  const startExercise = (exercise: Exercise) => {
    const totalTimePerRound = exercise.inhaleTime + exercise.holdInTime +
      exercise.exhaleTime + exercise.holdOutTime;
    const roundsForSelectedTime = Math.floor((selectedMinutes * 60) / totalTimePerRound);

    setSelectedExercise({
      ...exercise,
      rounds: roundsForSelectedTime
    });
    setIsExercising(true);
    setCurrentRound(1);
    setCurrentPhase('inhale');
    setTimeLeft(exercise.inhaleTime);
    setProgress(0);
  };

  const completeExercise = async () => {
    setIsExercising(false);
    playComplete();
    setExerciseCompleted(true);
    setStats(prev => {
      const newStats = {
        totalSessions: prev.totalSessions + 1,
        totalMinutes: prev.totalMinutes + selectedMinutes,
        lastCompleted: new Date()
      };
      localStorage.setItem('breathingStats', JSON.stringify(newStats));
      return newStats;
    });
  };

  const claimExperiencePoints = async () => {
    if (!user?.id || isClaimingXP) return;

    try {
      setIsClaimingXP(true);
      const xpBase = 10;
      const xpPorMinutoAdicional = (selectedMinutes - 1) * 5;
      const xpGanada = xpBase + xpPorMinutoAdicional;

      setEarnedXP({
        base: xpBase,
        bonus: xpPorMinutoAdicional,
        total: xpGanada
      });

      // Usar challengeService para completar la sesión
      await challengeService.completeSession(
        user.id,
        'respiration',
        selectedExercise?.name || 'Respiración',
        selectedMinutes,
        {
          exercise: selectedExercise?.name || 'Respiración',
          rounds: selectedExercise?.rounds || 0,
          effect: selectedExercise?.effect || 'BALANCING'
        }
      );

      // Mostrar notificación de logro
      if (window.showAchievementNotification) {
        window.showAchievementNotification({
          type: 'challenge',
          title: '¡Sesión Completada!',
          message: `Has completado ${selectedMinutes} minutos de respiración`,
          icon: '🧘',
          points: xpGanada
        });
      }

      setShowCompletionModal(true);
      setExerciseCompleted(false);
    } catch (error) {
      console.error('Error in claimExperiencePoints:', error);
    } finally {
      setIsClaimingXP(false);
    }
  };

  const getEffectIcon = (effect: string) => {
    switch (effect) {
      case 'BALANCING': return <Target className="w-5 h-5 text-amber-500" />;
      case 'CALMING': return <Heart className="w-5 h-5 text-amber-500" />;
      case 'ENERGIZING': return <Zap className="w-5 h-5 text-amber-500" />;
      default: return <Activity className="w-5 h-5 text-amber-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-stone-900 border border-stone-800 shadow-[4px_4px_0px_rgba(28,25,23,1)] rounded-none flex items-center justify-center">
              <Wind className="w-10 h-10 text-red-500" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-poppins-extrabold uppercase tracking-widest text-white mb-4">
            Ejercicios de Respiración
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed font-poppins-medium uppercase tracking-widest text-xs">
            Mejora tu control respiratorio y relájate con estos ejercicios de pranayama.
            Cada técnica tiene beneficios específicos para tu bienestar.
          </p>
        </motion.div>

        {/* Completion Modal */}
        {showCompletionModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCompletionModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-stone-900 rounded-none p-8 max-w-md w-full border border-stone-800 shadow-[8px_8px_0px_rgba(28,25,23,1)]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-red-600 rounded-none flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0px_rgba(153,27,27,1)] border border-red-500">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-poppins-bold uppercase tracking-widest text-white mb-4">¡Ejercicio Completado!</h3>
                <div className="bg-stone-950 border border-stone-800 rounded-none p-6 mb-6">
                  <div className="text-4xl font-poppins-bold text-amber-500 mb-2">
                    +{earnedXP.total} XP
                  </div>
                  <div className="text-xs uppercase tracking-widest text-gray-500 font-poppins-medium">
                    <div>Base: {earnedXP.base} XP</div>
                    <div>Bonus por tiempo: +{earnedXP.bonus} XP</div>
                  </div>
                </div>
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-none border border-red-500 font-poppins-bold uppercase tracking-wider transform hover:scale-105 transition-all duration-200 shadow-[4px_4px_0px_rgba(153,27,27,1)]"
                >
                  Continuar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {!isExercising ? (
          <div className="space-y-8">
            {/* Claim XP Button */}
            {exerciseCompleted && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <ResponsiveCard className="max-w-md mx-auto">
                  <button
                    onClick={claimExperiencePoints}
                    disabled={isClaimingXP}
                    className={`w-full px-6 py-4 rounded-xl font-bold text-white transition-all duration-200 transform hover:scale-105 ${isClaimingXP
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
                      } font-poppins-semibold`}
                  >
                    {isClaimingXP ? 'Reclamando XP...' : '🎉 ¡Reclamar XP Ganado!'}
                  </button>
                </ResponsiveCard>
              </motion.div>
            )}

            {/* Duration and Reward Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-stone-900 border border-stone-800 p-6 rounded-none shadow-[8px_8px_0px_rgba(28,25,23,1)] max-w-2xl mx-auto">
                <div className="mb-6">
                  <h3 className="text-xl font-poppins-bold uppercase tracking-wider text-white">Configuración del Ejercicio</h3>
                  <p className="text-sm font-poppins-medium text-gray-400">Ajusta la duración y ve tu recompensa</p>
                </div>
                <div className="space-y-6">
                  {/* Duration Slider */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-6 h-6 text-red-500" />
                      <label className="text-lg text-white font-poppins-bold uppercase tracking-wider">
                        Duración del ejercicio
                      </label>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max="30"
                        value={selectedMinutes}
                        onChange={(e) => setSelectedMinutes(parseInt(e.target.value))}
                        className="flex-1 h-3 bg-stone-950 border border-stone-800 rounded-none appearance-none cursor-pointer accent-red-600"
                      />
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={selectedMinutes}
                          onChange={(e) => setSelectedMinutes(Math.max(1, parseInt(e.target.value)))}
                          className="bg-stone-950 text-white px-4 py-2 rounded-none w-20 text-center font-poppins-bold border border-stone-800 focus:border-red-500 focus:outline-none"
                        />
                        <span className="text-gray-500 font-poppins-medium uppercase tracking-widest text-xs">min</span>
                      </div>
                    </div>
                  </div>

                  {/* Reward Section */}
                  <div className="bg-stone-950 border border-stone-800 rounded-none p-6 text-center">
                    <div className="flex items-center justify-center space-x-3 mb-4">
                      <Award className="w-6 h-6 text-amber-500" />
                      <h3 className="text-lg text-white font-poppins-bold uppercase tracking-widest">Recompensa</h3>
                    </div>
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <span className="text-4xl text-amber-500 font-poppins-extrabold">
                        {10 + (selectedMinutes - 1) * 5}
                      </span>
                      <span className="text-gray-500 font-poppins-medium uppercase tracking-widest">XP</span>
                    </div>
                    <p className="text-xs text-gray-600 font-poppins-medium uppercase tracking-widest">
                      Base: 10 XP + {(selectedMinutes - 1) * 5} XP por minutos adicionales
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="bg-stone-900 border border-stone-800 p-6 rounded-none shadow-[8px_8px_0px_rgba(28,25,23,1)] text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-stone-950 border border-stone-800 rounded-none flex items-center justify-center shadow-[4px_4px_0px_rgba(28,25,23,1)]">
                    <Activity className="w-6 h-6 text-red-500" />
                  </div>
                </div>
                <h3 className="text-3xl font-poppins-extrabold text-white mb-2">{stats.totalSessions}</h3>
                <p className="text-gray-500 text-xs font-poppins-bold uppercase tracking-widest">Sesiones Completadas</p>
              </div>

              <div className="bg-stone-900 border border-stone-800 p-6 rounded-none shadow-[8px_8px_0px_rgba(28,25,23,1)] text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-stone-950 border border-stone-800 rounded-none flex items-center justify-center shadow-[4px_4px_0px_rgba(28,25,23,1)]">
                    <Clock className="w-6 h-6 text-amber-500" />
                  </div>
                </div>
                <h3 className="text-3xl font-poppins-extrabold text-white mb-2">{stats.totalMinutes}</h3>
                <p className="text-gray-500 text-xs font-poppins-bold uppercase tracking-widest">Minutos Totales</p>
              </div>

              <div className="bg-stone-900 border border-stone-800 p-6 rounded-none shadow-[8px_8px_0px_rgba(28,25,23,1)] text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-stone-950 border border-stone-800 rounded-none flex items-center justify-center shadow-[4px_4px_0px_rgba(28,25,23,1)]">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-poppins-bold text-white mb-2 uppercase tracking-wide">
                  {stats.lastCompleted ? new Date(stats.lastCompleted).toLocaleDateString() : '-'}
                </h3>
                <p className="text-gray-500 text-xs font-poppins-bold uppercase tracking-widest">Última Sesión</p>
              </div>
            </motion.div>

            {/* Exercise Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {exercises.map((exercise, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => startExercise(exercise)}
                  className="group cursor-pointer"
                >
                  <div className="relative overflow-hidden bg-stone-900 rounded-none p-6 border border-stone-800 hover:border-red-500 transition-all duration-300 shadow-[8px_8px_0px_rgba(28,25,23,1)] hover:shadow-[8px_8px_0px_rgba(220,38,38,0.5)]">
                    {/* Background Overlay */}
                    <div className="absolute inset-0 bg-stone-950/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-poppins-bold uppercase tracking-wider text-white group-hover:text-red-500 transition-colors duration-300">
                          {exercise.name}
                        </h3>
                        <div className="px-3 py-1 rounded-none border border-stone-700 bg-stone-800 text-amber-500 text-xs font-poppins-bold uppercase tracking-widest">
                          {exercise.difficulty}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-400 text-sm leading-relaxed mb-4 font-poppins-medium">
                        {exercise.description}
                      </p>

                      {/* Details Grid */}
                      <div className="space-y-3">
                        {/* Effect */}
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-stone-950 border border-stone-800 rounded-none flex items-center justify-center">
                            {getEffectIcon(exercise.effect)}
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-poppins-bold uppercase tracking-widest">Efecto</p>
                            <p className="text-sm text-white font-poppins-bold uppercase tracking-wider">{exercise.effect}</p>
                          </div>
                        </div>

                        {/* Pattern */}
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-stone-950 border border-stone-800 rounded-none flex items-center justify-center">
                            <Brain className="w-4 h-4 text-amber-500" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 font-poppins-bold uppercase tracking-widest">Patrón</p>
                            <p className="text-sm text-white font-poppins-bold uppercase tracking-wider">
                              {exercise.inhaleTime}-{exercise.holdInTime}-{exercise.exhaleTime}-{exercise.holdOutTime}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Play Button */}
                      <div className="mt-6 flex justify-center">
                        <div className="w-12 h-12 bg-red-600 border border-red-500 rounded-none flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-[4px_4px_0px_rgba(153,27,27,1)]">
                          <Play className="w-5 h-5 text-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ) : (
          /* Exercise Session */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center space-y-8"
          >
            <div className="bg-stone-900 border border-stone-800 p-8 rounded-none shadow-[8px_8px_0px_rgba(28,25,23,1)] max-w-2xl w-full">
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-poppins-extrabold uppercase tracking-wider text-white">
                  {selectedExercise?.name}
                </h2>

                <div className="flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <div className="text-xs text-gray-500 font-poppins-bold uppercase tracking-widest">Ronda</div>
                    <div className="text-2xl font-poppins-bold text-white">
                      {currentRound}/{selectedExercise?.rounds}
                    </div>
                  </div>
                  <div className="w-32 bg-stone-950 rounded-none h-4 border border-stone-800 overflow-hidden">
                    <div
                      className="bg-red-600 h-full transition-all duration-300 shadow-[0_0_8px_rgba(220,38,38,0.5)]"
                      style={{
                        width: `${(currentRound / (selectedExercise?.rounds || 1)) * 100}%`
                      }}
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <BreathingCircle
                    phase={currentPhase}
                    progress={progress}
                    timeLeft={timeLeft}
                  />
                </AnimatePresence>

                <div className="flex justify-center mt-8">
                  <button
                    className="px-8 py-4 bg-stone-800 hover:bg-red-600 border border-stone-700 hover:border-red-500 text-white font-poppins-bold uppercase tracking-wider transition-all duration-200 shadow-[4px_4px_0px_rgba(28,25,23,1)] hover:shadow-[4px_4px_0px_rgba(153,27,27,1)] rounded-none flex items-center justify-center"
                    onClick={() => setIsExercising(false)}
                  >
                    <Pause className="w-5 h-5 inline mr-2" />
                    Terminar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}


      </div>
    </div>
  );
};

export default RespirationCalendar;