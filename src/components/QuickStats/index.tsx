import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

import { motion } from "framer-motion";
import { Trophy, Flame, TrendingUp, Users, Award, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickStats: React.FC = () => {

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
        const { data, error } = await supabase.rpc('get_global_stats');

        if (error) throw error;

        if (data) {
          setStats({
            totalUsers: data.total_users || 0,
            totalPoints: data.total_points || 0,
            bestStreak: data.best_streak || 0,
            challengesCompleted: data.challenges_completed || 0
          });
        }
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
      color: "text-white",
      bgColor: "bg-stone-800",
      borderColor: "border-stone-700 hover:border-red-500/50"
    },
    {
      icon: Trophy,
      value: stats.totalPoints.toLocaleString(),
      label: "Puntos Totales",
      color: "text-yellow-500",
      bgColor: "bg-stone-800",
      borderColor: "border-stone-700 hover:border-red-500/50"
    },
    {
      icon: Flame,
      value: stats.bestStreak,
      label: "Mejor Racha",
      color: "text-red-500",
      bgColor: "bg-stone-800",
      borderColor: "border-stone-700 hover:border-red-500/50"
    },
    {
      icon: Award,
      value: stats.challengesCompleted,
      label: "Retos Completados",
      color: "text-amber-500",
      bgColor: "bg-stone-800",
      borderColor: "border-stone-700 hover:border-red-500/50"
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
            whileTap={{ scale: 0.95 }}
            className={`${stat.bgColor} border ${stat.borderColor} rounded-xl p-4 text-center cursor-pointer transition-all duration-300 shadow-md`}
            onClick={() => navigate('/chochasafio')}
          >
            <div className={`w-8 h-8 flex items-center justify-center mx-auto mb-2`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-xl font-bold text-white mb-1 font-poppins-semibold">{stat.value}</p>
            <p className="text-gray-400 text-xs font-poppins-medium uppercase tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Call to Action para Interacción */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <TrendingUp className="w-8 h-8 text-red-500" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h3 className="text-xl font-poppins-bold uppercase tracking-wider text-white mb-2">
            NO TE QUEDES ATRÁS
          </h3>
          <p className="text-gray-400 mb-6 max-w-md mx-auto font-poppins-medium">
            Completa retos y compite. El tiempo no se detiene.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/chochasafio')}
              className="bg-red-600 text-white px-6 py-3 font-poppins-bold uppercase tracking-wide text-xs hover:bg-red-700 transition-colors shadow-lg shadow-red-900/30"
            >
              Ver Retos
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/thirty-days-challenge')}
              className="bg-stone-800 text-white border border-stone-700 px-6 py-3 font-poppins-bold uppercase tracking-wide text-xs hover:bg-stone-700 transition-colors hover:border-red-500/50"
            >
              Reto 30 Días
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/respiracion')}
              className="bg-stone-800 text-white border border-stone-700 px-6 py-3 font-poppins-bold uppercase tracking-wide text-xs hover:bg-stone-700 transition-colors"
            >
              Respiración
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Logros Destacados */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-stone-900 border border-stone-800 rounded-2xl p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-1 h-full bg-amber-500"></div>
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Star className="w-8 h-8 text-amber-500" />
          </div>
          <h3 className="text-xl font-poppins-bold uppercase tracking-wider text-white mb-2">
            LOGROS
          </h3>
          <p className="text-gray-400 mb-6 font-poppins-medium">
            Desbloquea logros manteniendo constancia.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-stone-800 rounded-lg p-4 border border-stone-700 hover:border-amber-500/30 transition-colors">
              <div className="text-2xl mb-2">🎯</div>
              <p className="text-white font-poppins-semibold text-sm">Primer Día</p>
              <p className="text-red-400 text-xs font-poppins-bold uppercase mt-1">+10 XP</p>
            </div>
            <div className="bg-stone-800 rounded-lg p-4 border border-stone-700 hover:border-amber-500/30 transition-colors">
              <div className="text-2xl mb-2">🔥</div>
              <p className="text-white font-poppins-semibold text-sm">Semana Completa</p>
              <p className="text-red-400 text-xs font-poppins-bold uppercase mt-1">+50 XP</p>
            </div>
            <div className="bg-stone-800 rounded-lg p-4 border border-stone-700 hover:border-amber-500/30 transition-colors">
              <div className="text-2xl mb-2">🏆</div>
              <p className="text-white font-poppins-semibold text-sm">Mes Completo</p>
              <p className="text-red-400 text-xs font-poppins-bold uppercase mt-1">+200 XP</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuickStats;
