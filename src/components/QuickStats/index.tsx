import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { challengeService } from "@/lib/challengeService";
import { motion } from "framer-motion";
import { Trophy, Target, Flame, Zap, TrendingUp, Users, Award, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickStats: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPoints: 0,
    bestStreak: 0,
    challengesCompleted: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Simular estadísticas globales (en un caso real, esto vendría de una API)
        setStats({
          totalUsers: 1247,
          totalPoints: 45678,
          bestStreak: 45,
          challengesCompleted: 89
        });
      } catch (error) {
        console.error("Error loading stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const statsData = [
    {
      icon: Users,
      value: stats.totalUsers.toLocaleString(),
      label: "Usuarios Activos",
      color: "from-blue-500 to-cyan-500",
      bgColor: "from-blue-500/10 to-cyan-500/10",
      borderColor: "border-blue-500/20"
    },
    {
      icon: Trophy,
      value: stats.totalPoints.toLocaleString(),
      label: "Puntos Totales",
      color: "from-yellow-500 to-orange-500",
      bgColor: "from-yellow-500/10 to-orange-500/10",
      borderColor: "border-yellow-500/20"
    },
    {
      icon: Flame,
      value: stats.bestStreak,
      label: "Mejor Racha",
      color: "from-red-500 to-pink-500",
      bgColor: "from-red-500/10 to-pink-500/10",
      borderColor: "border-red-500/20"
    },
    {
      icon: Award,
      value: stats.challengesCompleted,
      label: "Retos Completados",
      color: "from-green-500 to-emerald-500",
      bgColor: "from-green-500/10 to-emerald-500/10",
      borderColor: "border-green-500/20"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-800/50 rounded-xl p-4 animate-pulse">
            <div className="w-8 h-8 bg-gray-700 rounded-full mb-2"></div>
            <div className="h-6 bg-gray-700 rounded mb-1"></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas Rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {statsData.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            className={`bg-gradient-to-br ${stat.bgColor} border ${stat.borderColor} rounded-xl p-4 text-center cursor-pointer transition-all duration-300`}
            onClick={() => navigate('/chochasafio')}
          >
            <div className={`w-8 h-8 bg-gradient-to-r ${stat.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-xl font-bold text-white mb-1">{stat.value}</p>
            <p className="text-gray-400 text-xs">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Call to Action para Interacción */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 border border-pink-500/20 rounded-2xl p-6"
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <TrendingUp className="w-8 h-8 text-pink-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            ¡Únete a la Competencia!
          </h3>
          <p className="text-gray-300 mb-4 max-w-md mx-auto">
            Completa retos, gana puntos y compite con otros usuarios para llegar a la cima del ranking.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate('/chochasafio')}
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-pink-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 text-sm"
            >
              Ver Retos
            </button>
            <button
              onClick={() => navigate('/thirty-days-challenge')}
              className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-200 text-sm"
            >
              Reto 30 Días
            </button>
            <button
              onClick={() => navigate('/respiracion')}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 text-sm"
            >
              Respiración
            </button>
          </div>
        </div>
      </motion.div>

      {/* Logros Destacados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-2xl p-6"
      >
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Star className="w-8 h-8 text-yellow-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            Logros Destacados
          </h3>
          <p className="text-gray-300 mb-4">
            Desbloquea logros especiales completando retos y manteniendo rachas.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-2xl mb-1">🎯</div>
              <p className="text-white font-semibold text-sm">Primer Día</p>
              <p className="text-gray-400 text-xs">+10 XP</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-2xl mb-1">🔥</div>
              <p className="text-white font-semibold text-sm">Semana Completa</p>
              <p className="text-gray-400 text-xs">+50 XP</p>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3">
              <div className="text-2xl mb-1">🏆</div>
              <p className="text-white font-semibold text-sm">Mes Completo</p>
              <p className="text-gray-400 text-xs">+200 XP</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuickStats;
