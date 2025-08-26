import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { challengeService, type UserChallenge, type ChallengeStats, type ChallengeType } from "@/lib/challengeService";
import ResponsiveCard from "../common/ResponsiveCard";
import { Calendar, Target, Trophy, TrendingUp, Clock, CheckCircle, Activity, Zap } from "lucide-react";
import { motion } from "framer-motion";

interface ChallengeInfo {
  type: ChallengeType;
  name: string;
  description: string;
  icon: string;
  color: string;
  gradient: string;
}

const challengeTypes: ChallengeInfo[] = [
  {
    type: 'chochasafio',
    name: 'Chochasafio',
    description: 'Reto de ejercicios para aumentar el tamaño',
    icon: '🍆',
    color: 'pink',
    gradient: 'from-pink-500 to-purple-600'
  },
  {
    type: '30_days',
    name: 'Reto de 30 Días',
    description: 'Programa completo de ejercicios',
    icon: '📅',
    color: 'blue',
    gradient: 'from-blue-500 to-purple-600'
  },
  {
    type: 'respiration',
    name: 'Respiración',
    description: 'Ejercicios de respiración y meditación',
    icon: '🧘',
    color: 'green',
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    type: 'keguel',
    name: 'Keguel',
    description: 'Ejercicios de fortalecimiento pélvico',
    icon: '💪',
    color: 'orange',
    gradient: 'from-orange-500 to-red-600'
  },
  {
    type: 'routines',
    name: 'Rutinas',
    description: 'Rutinas especializadas de entrenamiento',
    icon: '🏋️',
    color: 'purple',
    gradient: 'from-purple-500 to-indigo-600'
  }
];

const AllChallengesProgress: React.FC = () => {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<UserChallenge[]>([]);
  const [stats, setStats] = useState<ChallengeStats[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const loadAllProgress = async () => {
      setIsLoading(true);
      try {
        const [userChallenges, userStats] = await Promise.all([
          challengeService.getAllUserChallenges(user.id),
          challengeService.getAllUserStats(user.id)
        ]);
        setChallenges(userChallenges);
        setStats(userStats);
      } catch (error) {
        console.error("Error loading all progress:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllProgress();
  }, [user?.id]);

  const getChallengeInfo = (type: ChallengeType): ChallengeInfo => {
    return challengeTypes.find(ct => ct.type === type) || challengeTypes[0];
  };

  const getChallengeProgress = (type: ChallengeType) => {
    const challenge = challenges.find(c => c.challenge_type === type);
    const stat = stats.find(s => s.challenge_type === type);
    
    return {
      challenge,
      stat,
      info: getChallengeInfo(type)
    };
  };

  const getTotalStats = () => {
    const totalSessions = stats.reduce((sum, stat) => sum + stat.total_sessions, 0);
    const totalMinutes = stats.reduce((sum, stat) => sum + stat.total_minutes, 0);
    const totalChallenges = challenges.filter(c => !c.is_active).length;
    const bestStreak = Math.max(...challenges.map(c => c.streak_days), 0);
    
    return { totalSessions, totalMinutes, totalChallenges, bestStreak };
  };

  if (isLoading) {
    return (
      <ResponsiveCard>
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
          <p className="text-gray-300">Cargando progreso de todos los retos...</p>
        </div>
      </ResponsiveCard>
    );
  }

  const totalStats = getTotalStats();

  return (
    <div className="space-y-6">
      {/* Resumen General */}
      <ResponsiveCard
        title="Resumen General de Todos los Retos"
        subtitle="Progreso combinado de todos tus retos activos"
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-white">{totalStats.totalSessions}</p>
            <p className="text-gray-400 text-sm">Sesiones Totales</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-white">{totalStats.totalMinutes}</p>
            <p className="text-gray-400 text-sm">Minutos Totales</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-white">{totalStats.totalChallenges}</p>
            <p className="text-gray-400 text-sm">Retos Completados</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <p className="text-2xl font-bold text-white">{totalStats.bestStreak}</p>
            <p className="text-gray-400 text-sm">Mejor Racha</p>
          </div>
        </div>
      </ResponsiveCard>

      {/* Progreso por Reto */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {challengeTypes.map((challengeType, index) => {
          const { challenge, stat, info } = getChallengeProgress(challengeType.type);
          
          return (
            <motion.div
              key={challengeType.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ResponsiveCard
                title={info.name}
                subtitle={info.description}
              >
                <div className="space-y-4">
                  {/* Header con icono */}
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${info.gradient} rounded-full flex items-center justify-center text-xl`}>
                      {info.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{info.name}</h3>
                      <p className="text-gray-400 text-sm">{info.description}</p>
                    </div>
                  </div>

                  {/* Estado del reto */}
                  <div className="space-y-2">
                    {challenge ? (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Estado:</span>
                          <span className={`font-semibold ${challenge.is_active ? 'text-green-400' : 'text-yellow-400'}`}>
                            {challenge.is_active ? 'Activo' : 'Completado'}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Progreso:</span>
                          <span className="text-white font-semibold">
                            {challenge.completed_days}/{challenge.total_days}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Racha:</span>
                          <span className="text-white font-semibold">{challenge.streak_days} días</span>
                        </div>

                        {/* Barra de progreso */}
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Progreso</span>
                            <span>{Math.round((challenge.completed_days / challenge.total_days) * 100)}%</span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-2">
                            <motion.div
                              className={`bg-gradient-to-r ${info.gradient} h-2 rounded-full`}
                              initial={{ width: 0 }}
                              animate={{ width: `${(challenge.completed_days / challenge.total_days) * 100}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-400 mb-2">No has comenzado este reto</p>
                        <button className="bg-gray-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-600 transition-colors">
                          Comenzar Reto
                        </button>
                      </div>
                    )}

                    {/* Estadísticas específicas */}
                    {stat && (
                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="text-center">
                            <p className="text-gray-400">Sesiones</p>
                            <p className="text-white font-semibold">{stat.total_sessions}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-400">Minutos</p>
                            <p className="text-white font-semibold">{stat.total_minutes}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </ResponsiveCard>
            </motion.div>
          );
        })}
      </div>

      {/* Retos Activos */}
      {challenges.filter(c => c.is_active).length > 0 && (
        <ResponsiveCard title="Retos Activos" subtitle="Retos que estás realizando actualmente">
          <div className="space-y-3">
            {challenges
              .filter(c => c.is_active)
              .map((challenge) => {
                const info = getChallengeInfo(challenge.challenge_type as ChallengeType);
                return (
                  <motion.div
                    key={challenge.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 bg-gradient-to-r ${info.gradient} rounded-full flex items-center justify-center`}>
                        {info.icon}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{info.name}</p>
                        <p className="text-gray-400 text-sm">
                          Día {challenge.current_day} • Racha: {challenge.streak_days} días
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-semibold">
                        {Math.round((challenge.completed_days / challenge.total_days) * 100)}%
                      </p>
                      <p className="text-gray-500 text-xs">
                        {challenge.completed_days}/{challenge.total_days}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </ResponsiveCard>
      )}
    </div>
  );
};

export default AllChallengesProgress;
