import { useState, useEffect, useRef } from "react";
import { useUser } from "@supabase/auth-helpers-react";
import { supabase } from "@/lib/supabaseClient";
import { challengeService, type LeaderboardEntry } from "@/lib/challengeService";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Crown, Medal, Star, TrendingUp, Zap, Target, Flame } from "lucide-react";

const LeaderboardTable = () => {
  const user = useUser();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const fetchLeaderboard = async () => {
      if (!isMountedRef.current) return;

      setIsLoading(true);

      try {
        const leaderboardData = await challengeService.getLeaderboard(10);

        if (isMountedRef.current) {
          setLeaderboard(leaderboardData);
        }
      } catch (error) {
        console.error("Error al obtener la tabla de líderes:", error);
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
        }
      }
    };

    // Cargar datos iniciales
    fetchLeaderboard();

    // Configurar suscripción para actualizaciones en tiempo real
    const subscription = supabase
      .channel('leaderboard_changes')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leaderboard',
        },
        () => {
          fetchLeaderboard();
        }
      )
      .subscribe();

    // Limpieza al desmontar el componente
    return () => {
      isMountedRef.current = false;
      supabase.removeChannel(subscription);
    };
  }, [user?.id]);

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-500" />;
      default:
        return <Star className="w-4 h-4 text-blue-500" />;
    }
  };

  const getRankBadge = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 3:
        return "bg-gradient-to-r from-orange-400 to-orange-600 text-white";
      default:
        return "bg-gray-700 text-blue-400 border border-gray-600";
    }
  };

  const getRankText = (position: number) => {
    switch (position) {
      case 1:
        return "1°";
      case 2:
        return "2°";
      case 3:
        return "3°";
      default:
        return `#${position}`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-medium">Cargando líderes...</p>
          <p className="text-gray-400 text-sm">Obteniendo datos de la tabla</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-yellow-500" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Tabla de Líderes
          </h1>
          <p className="text-gray-400">
            Los mejores jugadores de Pichasafio
          </p>
        </div>
      </motion.div>

      {/* Estadísticas rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
          <div className="flex justify-center mb-2">
            <TrendingUp className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-white">{leaderboard.length}</p>
          <p className="text-gray-400 text-sm">Competidores</p>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
          <div className="flex justify-center mb-2">
            <Target className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-white">
            {leaderboard[0]?.total_points || 0}
          </p>
          <p className="text-gray-400 text-sm">Puntos Máximos</p>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
          <div className="flex justify-center mb-2">
            <Flame className="w-6 h-6 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-white">
            {leaderboard.length > 0 ? Math.max(...leaderboard.map(e => e.current_streak)) : 0}
          </p>
          <p className="text-gray-400 text-sm">Mejor Racha</p>
        </div>
        
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center">
          <div className="flex justify-center mb-2">
            <Zap className="w-6 h-6 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-white">
            {leaderboard.length > 0 ? Math.max(...leaderboard.map(e => e.level)) : 1}
          </p>
          <p className="text-gray-400 text-sm">Nivel Máximo</p>
        </div>
      </motion.div>

      {/* Tabla de líderes */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
            <Trophy className="w-5 h-5 text-yellow-500 mr-2" />
            Ranking de Líderes
          </h2>
          
          <div className="space-y-3">
            <AnimatePresence>
              {leaderboard.map((entry, index) => {
                const position = index + 1;
                const isCurrentUser = entry.user_id === user?.id;
                
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 5 }}
                    className={`relative group ${
                      isCurrentUser 
                        ? 'bg-blue-900/30 border border-blue-400/50' 
                        : 'bg-gray-700/60 hover:bg-gray-600/60 border border-gray-600/30 hover:border-gray-500/40'
                    } rounded-xl p-4 transition-all duration-300`}
                  >
                    {/* Efecto de brillo en hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-700/0 via-gray-600/0 to-gray-500/0 group-hover:from-gray-700/10 group-hover:via-gray-600/10 group-hover:to-gray-500/10 rounded-xl transition-all duration-500"></div>
                    
                    <div className="relative flex items-center justify-between">
                      {/* Lado izquierdo - Ranking y usuario */}
                      <div className="flex items-center space-x-4">
                        {/* Badge de posición */}
                        <div className={`relative ${getRankBadge(position)} px-3 py-1 rounded-full font-bold text-sm min-w-[60px] text-center`}>
                          {getRankIcon(position)}
                          <span className="ml-1">{getRankText(position)}</span>
                        </div>
                        
                        {/* Información del usuario */}
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {entry.username ? entry.username.charAt(0).toUpperCase() : 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-white">
                              {entry.username || `Usuario ${entry.user_id.slice(0, 8)}...`}
                              {isCurrentUser && (
                                <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full border border-blue-400/50">
                                  TÚ
                                </span>
                              )}
                            </p>
                            <div className="flex items-center space-x-2 text-sm">
                              <span className="text-gray-400">Nivel {entry.level}</span>
                              <span className="text-gray-500">•</span>
                              <span className="text-blue-400 font-medium">{entry.rank}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Lado derecho - Estadísticas */}
                      <div className="flex items-center space-x-6">
                        {/* Puntos */}
                        <div className="text-right">
                          <p className="text-2xl font-bold text-yellow-500">
                            {entry.total_points.toLocaleString()}
                          </p>
                          <p className="text-gray-400 text-sm">XP</p>
                        </div>
                        
                        {/* Racha */}
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <p className="font-semibold text-orange-500">{entry.current_streak}</p>
                          </div>
                          <p className="text-gray-400 text-xs">días</p>
                        </div>
                        
                        {/* Sesiones */}
                        <div className="text-right">
                          <p className="font-semibold text-blue-400">{entry.total_sessions}</p>
                          <p className="text-gray-400 text-xs">sesiones</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Barra de progreso sutil */}
                    <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(entry.total_points / (leaderboard.length > 0 ? Math.max(...leaderboard.map(e => e.total_points)) : 1)) * 100}%` }}
                        transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          
          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-gray-700/50 text-center">
            <p className="text-gray-400 text-sm">
              Actualizado en tiempo real • Última actualización: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardTable;
