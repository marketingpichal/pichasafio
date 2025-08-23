import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { challengeService, type UserChallenge, type DailyProgress } from "@/lib/challengeService";
import ResponsiveCard from "../common/ResponsiveCard";
import { Calendar, Target, Trophy, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const ProgressTracker: React.FC = () => {
  const { user } = useAuth();
  const [challenge, setChallenge] = useState<UserChallenge | null>(null);
  const [progress, setProgress] = useState<DailyProgress[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const loadProgress = async () => {
      setIsLoading(true);
      try {
        const { challenge: userChallenge, progress: userProgress } = await challengeService.getUserProgress(user.id, 'chochasafio');
        setChallenge(userChallenge);
        setProgress(userProgress);
      } catch (error) {
        console.error("Error loading progress:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProgress();
  }, [user?.id]);

  if (isLoading) {
    return (
      <ResponsiveCard>
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
          <p className="text-gray-300">Cargando progreso...</p>
        </div>
      </ResponsiveCard>
    );
  }

  if (!challenge) {
    return (
      <ResponsiveCard>
        <div className="text-center py-8">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">No hay reto activo</p>
          <p className="text-gray-500 text-sm">
            Comienza un reto para ver tu progreso aquí
          </p>
        </div>
      </ResponsiveCard>
    );
  }

  const progressPercentage = Math.round((challenge.completed_days / challenge.total_days) * 100);
  const daysRemaining = challenge.total_days - challenge.completed_days;

  return (
    <div className="space-y-6">
      {/* Resumen del Progreso */}
      <ResponsiveCard
        title="Resumen del Reto"
        subtitle={`${challenge.challenge_type.replace('_', ' ').toUpperCase()}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Calendar className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-white">{challenge.completed_days}</p>
            <p className="text-gray-400 text-sm">Días Completados</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Target className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">{challenge.streak_days}</p>
            <p className="text-gray-400 text-sm">Días de Racha</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <p className="text-2xl font-bold text-white">{progressPercentage}%</p>
            <p className="text-gray-400 text-sm">Progreso</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-white">{daysRemaining}</p>
            <p className="text-gray-400 text-sm">Días Restantes</p>
          </div>
        </div>

        {/* Barra de Progreso */}
        <div className="mt-6">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Progreso</span>
            <span>{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <motion.div
              className="bg-gradient-to-r from-pink-500 to-purple-600 h-3 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />
          </div>
        </div>
      </ResponsiveCard>

      {/* Historial de Días Completados */}
      <ResponsiveCard
        title="Historial de Ejercicios"
        subtitle={`Últimos ${progress.length} días completados`}
      >
        {progress.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">Aún no has completado ningún día</p>
            <p className="text-gray-500 text-sm">
              Comienza con el día 1 para ver tu historial aquí
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {progress.slice(-10).reverse().map((dayProgress) => (
              <motion.div
                key={dayProgress.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">Día {dayProgress.day_number}</p>
                    <p className="text-gray-400 text-sm">{dayProgress.exercise_name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-green-400 font-semibold">+{dayProgress.points_earned} XP</p>
                  <p className="text-gray-500 text-xs">
                    {new Date(dayProgress.completed_at).toLocaleDateString('es-ES')}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </ResponsiveCard>

      {/* Estadísticas Adicionales */}
      <ResponsiveCard title="Estadísticas Detalladas">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-400 mr-2" />
              Información del Reto
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Fecha de Inicio:</span>
                <span className="text-white">
                  {new Date(challenge.start_date).toLocaleDateString('es-ES')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Día Actual:</span>
                <span className="text-white">{challenge.current_day}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Estado:</span>
                <span className={`font-semibold ${challenge.is_active ? 'text-green-400' : 'text-yellow-400'}`}>
                  {challenge.is_active ? 'Activo' : 'Completado'}
                </span>
              </div>
              {challenge.end_date && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Fecha de Finalización:</span>
                  <span className="text-white">
                    {new Date(challenge.end_date).toLocaleDateString('es-ES')}
                  </span>
                </div>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
              <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
              Logros y Puntos
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total de Puntos:</span>
                <span className="text-white font-semibold">
                  {progress.reduce((total, p) => total + p.points_earned, 0)} XP
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Promedio por Día:</span>
                <span className="text-white">
                  {progress.length > 0 
                    ? Math.round(progress.reduce((total, p) => total + p.points_earned, 0) / progress.length)
                    : 0} XP
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Días con Anuncios:</span>
                <span className="text-white">
                  {progress.filter(p => p.ad_watched).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Racha Más Larga:</span>
                <span className="text-white">{challenge.streak_days} días</span>
              </div>
            </div>
          </div>
        </div>
      </ResponsiveCard>
    </div>
  );
};

export default ProgressTracker;
