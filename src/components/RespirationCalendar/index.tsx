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
      case 'inhale': return 'text-blue-400';
      case 'holdIn': return 'text-purple-400';
      case 'exhale': return 'text-green-400';
      case 'holdOut': return 'text-orange-400';
      default: return 'text-gray-400';
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
          <div className="text-2xl font-poppins-bold mb-2">
            {phase === 'inhale' && "Inhala"}
            {phase === 'holdIn' && "Mantén"}
            {phase === 'exhale' && "Exhala"}
            {phase === 'holdOut' && "Mantén"}
            {phase === 'rest' && "Prepárate"}
          </div>
          <div className="text-4xl font-poppins-bold text-blue-400">{Math.ceil(timeLeft)}s</div>
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
      case 'BALANCING': return <Target className="w-5 h-5" />;
      case 'CALMING': return <Heart className="w-5 h-5" />;
      case 'ENERGIZING': return <Zap className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  const getEffectColor = (effect: string) => {
    switch (effect) {
      case 'BALANCING': return 'from-purple-500 to-pink-500';
      case 'CALMING': return 'from-blue-500 to-cyan-500';
      case 'ENERGIZING': return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'from-green-500 to-emerald-500';
      case 'intermediate': return 'from-yellow-500 to-orange-500';
      case 'advanced': return 'from-red-500 to-pink-500';
      default: return 'from-blue-500 to-purple-500';
    }
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
            <div className="w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
              <Wind className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text-extended mb-4 font-poppins">
            Ejercicios de Respiración
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed font-poppins-light">
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 rounded-2xl p-8 max-w-md w-full border border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 font-poppins-bold">¡Ejercicio Completado!</h3>
                <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl p-6 mb-6">
                  <div className="text-4xl font-bold text-yellow-400 mb-2 font-poppins-bold">
                    +{earnedXP.total} XP
                  </div>
                  <div className="text-sm text-gray-300 font-poppins-light">
                    <div>Base: {earnedXP.base} XP</div>
                    <div>Bonus por tiempo: +{earnedXP.bonus} XP</div>
                  </div>
                </div>
                <button
                  onClick={() => setShowCompletionModal(false)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 font-poppins-semibold"
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
                    className={`w-full px-6 py-4 rounded-xl font-bold text-white transition-all duration-200 transform hover:scale-105 ${
                      isClaimingXP 
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
              <ResponsiveCard
                title="Configuración del Ejercicio"
                subtitle="Ajusta la duración y ve tu recompensa"
              >
                <div className="space-y-6">
                  {/* Duration Slider */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Clock className="w-6 h-6 text-blue-400" />
                      <label className="text-lg font-medium text-white font-poppins-semibold">
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
                        className="flex-1 h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex items-center gap-2 min-w-[120px]">
                        <input
                          type="number"
                          min="1"
                          max="30"
                          value={selectedMinutes}
                          onChange={(e) => setSelectedMinutes(Math.max(1, parseInt(e.target.value)))}
                          className="bg-gray-700 text-white px-4 py-2 rounded-xl w-20 text-center font-poppins-semibold border border-gray-600 focus:border-blue-500 focus:outline-none"
                        />
                        <span className="text-gray-300 font-poppins-medium">min</span>
                      </div>
                    </div>
                  </div>

                  {/* Reward Section */}
                  <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Award className="w-6 h-6 text-yellow-400" />
                      <h3 className="text-lg font-semibold text-white font-poppins-semibold">Recompensa</h3>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-3xl font-bold text-yellow-400 font-poppins-bold">
                        {10 + (selectedMinutes - 1) * 5}
                      </span>
                      <span className="text-gray-300 font-poppins-medium">XP</span>
                    </div>
                    <p className="text-sm text-gray-400 font-poppins-light">
                      Base: 10 XP + {(selectedMinutes - 1) * 5} XP por minutos adicionales
                    </p>
                  </div>
                </div>
              </ResponsiveCard>
            </motion.div>

            {/* Statistics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <ResponsiveCard className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 font-poppins-bold">{stats.totalSessions}</h3>
                <p className="text-gray-300 text-sm font-poppins-light">Sesiones Completadas</p>
              </ResponsiveCard>

              <ResponsiveCard className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 font-poppins-bold">{stats.totalMinutes}</h3>
                <p className="text-gray-300 text-sm font-poppins-light">Minutos Totales</p>
              </ResponsiveCard>

              <ResponsiveCard className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 font-poppins-bold">
                  {stats.lastCompleted ? new Date(stats.lastCompleted).toLocaleDateString() : '-'}
                </h3>
                <p className="text-gray-300 text-sm font-poppins-light">Última Sesión</p>
              </ResponsiveCard>
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
                  <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl">
                    {/* Gradient overlay on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${getEffectColor(exercise.effect)}/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                    
                    <div className="relative z-10">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors duration-300 font-poppins-semibold">
                          {exercise.name}
                        </h3>
                        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getDifficultyColor(exercise.difficulty)} text-white text-xs font-semibold font-poppins-medium`}>
                          {exercise.difficulty}
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-300 text-sm leading-relaxed mb-4 font-poppins-light">
                        {exercise.description}
                      </p>

                      {/* Details Grid */}
                      <div className="space-y-3">
                        {/* Effect */}
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 bg-gradient-to-r ${getEffectColor(exercise.effect)} rounded-lg flex items-center justify-center`}>
                            {getEffectIcon(exercise.effect)}
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-medium font-poppins-medium">Efecto</p>
                            <p className="text-sm text-white font-semibold font-poppins-semibold">{exercise.effect}</p>
                          </div>
                        </div>

                        {/* Pattern */}
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <Brain className="w-4 h-4 text-white" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-medium font-poppins-medium">Patrón</p>
                            <p className="text-sm text-white font-semibold font-poppins-semibold">
                              {exercise.inhaleTime}-{exercise.holdInTime}-{exercise.exhaleTime}-{exercise.holdOutTime}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Play Button */}
                      <div className="mt-6 flex justify-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
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
            <ResponsiveCard className="max-w-2xl w-full">
              <div className="text-center space-y-6">
                <h2 className="text-2xl font-bold text-white font-poppins-bold">
                  {selectedExercise?.name}
                </h2>
                
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-400 font-poppins-medium">Ronda</div>
                    <div className="text-2xl font-bold text-white font-poppins-bold">
                      {currentRound}/{selectedExercise?.rounds}
                    </div>
                  </div>
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
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

                <div className="flex space-x-4">
                  <button
                    className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl hover:from-red-600 hover:to-pink-700 text-white font-semibold transition-all duration-200 transform hover:scale-105 font-poppins-semibold"
                    onClick={() => setIsExercising(false)}
                  >
                    <Pause className="w-5 h-5 inline mr-2" />
                    Terminar
                  </button>
                </div>
              </div>
            </ResponsiveCard>
          </motion.div>
        )}


      </div>
    </div>
  );
};

export default RespirationCalendar;