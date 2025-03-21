import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import useSound from 'use-sound';
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";
import LeaderboardTable from "@/components/LeaderboardTable";

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
          className="text-blue-500"
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
        >
          {phase === 'inhale' && "Inhala"}
          {phase === 'holdIn' && "Mantén"}
          {phase === 'exhale' && "Exhala"}
          {phase === 'holdOut' && "Mantén"}
          {phase === 'rest' && "Prepárate"}
        </motion.div>
        <div className="text-sm mt-2">{Math.ceil(timeLeft)}s</div>
      </div>
    </motion.div>
  );
};

const RespirationCalendar: React.FC = () => {
  const supabase = useSupabaseClient();
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
    setExerciseCompleted(true);  // Mark exercise as completed
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
      
      const { data: existingUser, error: userError } = await supabase
        .from('leaderboard')
        .select('points, level, rank')
        .eq('profileId', user.id)
        .single();

      if (userError && userError.code !== 'PGRST116') {
        throw new Error('Error fetching user data');
      }

      const currentPoints = existingUser?.points || 0;
      const newPoints = currentPoints + xpGanada;
      const newLevel = Math.floor(newPoints / 1000) + 1;
      
      let newRank = 'Novato';
      if (newPoints >= 5000) newRank = 'Maestro';
      else if (newPoints >= 3000) newRank = 'Experto';
      else if (newPoints >= 1000) newRank = 'Avanzado';
      else if (newPoints >= 500) newRank = 'Intermedio';

      if (existingUser) {
        const { error: updateError } = await supabase
          .from('leaderboard')
          .update({
            points: newPoints,
            level: newLevel,
            rank: newRank,
            last_activity: new Date().toISOString(),
          })
          .eq('profileId', user.id);

        if (updateError) throw new Error('Error updating points');
      } else {
        const { error: insertError } = await supabase
          .from('leaderboard')
          .insert([{
            profileId: user.id,
            points: xpGanada,
            level: 1,
            rank: 'Novato',
            last_activity: new Date().toISOString(),
          }]);

        if (insertError) throw new Error('Error inserting new user');
      }

      setShowCompletionModal(true);
      setExerciseCompleted(false);
    } catch (error) {
      console.error('Error in claimExperiencePoints:', error);
    } finally {
      setIsClaimingXP(false);
    }
  };

  // Modify the return JSX to include the claim button
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {showCompletionModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-gray-800 p-8 rounded-xl shadow-xl max-w-md w-full mx-4"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">¡Ejercicio Completado!</h3>
              <div className="bg-gray-700 rounded-lg p-6 mb-6">
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  +{earnedXP.total} XP
                </div>
                <div className="text-sm text-gray-300">
                  <div>Base: {earnedXP.base} XP</div>
                  <div>Bonus por tiempo: +{earnedXP.bonus} XP</div>
                </div>
              </div>
              <button
                onClick={() => setShowCompletionModal(false)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
              >
                Continuar
              </button>
            </div>
          </motion.div>
        </div>
      )}
      <Card className="max-w-4xl mx-auto bg-gray-800">
        <CardContent className="p-6">
          {!isExercising ? (
            <>
              {exerciseCompleted && (
                <div className="mb-8 text-center">
                  <button
                    onClick={claimExperiencePoints}
                    disabled={isClaimingXP}
                    className={`px-6 py-3 rounded-lg text-white font-bold ${
                      isClaimingXP 
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {isClaimingXP ? 'Reclamando XP...' : 'Reclamar XP'}
                  </button>
                </div>
              )}
              <div className="mb-8">
                <label className="block text-lg font-medium mb-4">
                  Duración del ejercicio
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    value={selectedMinutes}
                    onChange={(e) => setSelectedMinutes(parseInt(e.target.value))}
                    className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex items-center gap-2 min-w-[100px]">
                    <input
                      type="number"
                      min="1"
                      max="30"
                      value={selectedMinutes}
                      onChange={(e) => setSelectedMinutes(Math.max(1, parseInt(e.target.value)))}
                      className="bg-gray-700 text-white px-3 py-2 rounded-lg w-20 text-center"
                    />
                    <span className="text-gray-300">min</span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                  <p className="text-lg font-medium mb-2">Recompensa</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold text-yellow-400">
                      {10 + (selectedMinutes - 1) * 5}
                    </span>
                    <span className="text-gray-300">XP</span>
                  </div>
                  <p className="text-sm text-gray-400 mt-1">
                    Base: 10 XP + {(selectedMinutes - 1) * 5} XP por minutos adicionales
                  </p>
                </div>
              </div>

              <div className="mb-8 grid grid-cols-3 gap-4 text-center">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-2xl font-bold">{stats.totalSessions}</div>
                  <div className="text-sm text-gray-300">Sesiones Completadas</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-2xl font-bold">{stats.totalMinutes}</div>
                  <div className="text-sm text-gray-300">Minutos Totales</div>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <div className="text-2xl font-bold">
                    {stats.lastCompleted ? new Date(stats.lastCompleted).toLocaleDateString() : '-'}
                  </div>
                  <div className="text-sm text-gray-300">Última Sesión</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {exercises.map((exercise, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      exercise.effect === 'BALANCING' ? 'bg-purple-700 hover:bg-purple-600' :
                      exercise.effect === 'CALMING' ? 'bg-blue-700 hover:bg-blue-600' :
                      'bg-green-700 hover:bg-green-600'
                    }`}
                    onClick={() => startExercise(exercise)}
                  >
                    <h3 className="text-xl font-bold mb-2">{exercise.name}</h3>
                    <p className="text-gray-100 mb-2">{exercise.description}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-200">Efecto: {exercise.effect}</span>
                      <span className="text-gray-200">Dificultad: {exercise.difficulty}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-8">
              <h2 className="text-2xl font-bold text-white">
                {selectedExercise?.name} - Ronda {currentRound}/{selectedExercise?.rounds}
              </h2>
              
              <div className="w-full max-w-md bg-gray-700 rounded-full h-2 mb-4">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${(currentRound / (selectedExercise?.rounds || 1)) * 100}%` 
                  }}
                />
              </div>

              <AnimatePresence mode="wait">
                <BreathingCircle
                  phase={currentPhase}
                  progress={progress}
                  timeLeft={timeLeft}
                />
              </AnimatePresence>

              <button
                className="px-6 py-2 bg-red-500 rounded-lg hover:bg-red-600 text-white"
                onClick={() => setIsExercising(false)}
              >
                Terminar (Espacio)
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add LeaderboardTable component */}
      <LeaderboardTable />
    </div>
  );
};

export default RespirationCalendar;