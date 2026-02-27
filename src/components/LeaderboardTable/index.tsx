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
    let debounceTimer: ReturnType<typeof setTimeout> | null = null;

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

    // Debounced fetch to prevent rapid-fire from real-time events
    const debouncedFetch = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        fetchLeaderboard();
      }, 2000);
    };

    // Cargar datos iniciales
    fetchLeaderboard();

    // Configurar suscripción para actualizaciones en tiempo real
    const subscription = supabase
      .channel('leaderboard_changes')
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'leaderboard',
        },
        debouncedFetch
      )
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'leaderboard',
        },
        debouncedFetch
      )
      .subscribe();

    // Limpieza al desmontar el componente
    return () => {
      isMountedRef.current = false;
      if (debounceTimer) clearTimeout(debounceTimer);
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
        return "bg-amber-500 text-stone-950";
      case 2:
        return "bg-gray-300 text-stone-950";
      case 3:
        return "bg-amber-700 text-white";
      default:
        return "bg-stone-800 text-gray-400 border border-stone-700";
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
          <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white font-poppins-medium uppercase tracking-wider">Cargando líderes...</p>
          <p className="text-gray-500 text-sm font-poppins-light">Obteniendo datos de la tabla</p>
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
        <div className="bg-stone-900 rounded-none p-8 border border-stone-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>
          <div className="flex items-center justify-center mb-4">
            <Trophy className="w-12 h-12 text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]" />
          </div>
          <h1 className="text-3xl font-poppins-extrabold uppercase tracking-tight text-white mb-2 drop-shadow-md">
            TABLA DE LÍDERES
          </h1>
          <p className="text-gray-400 font-poppins-medium tracking-wide">
            LOS MEJORES JUGADORES DE PICHASAFIO
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
        <div className="bg-stone-900 border border-stone-800 rounded-none p-4 text-center hover:border-red-500/30 transition-colors">
          <div className="flex justify-center mb-2">
            <TrendingUp className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-2xl font-poppins-bold text-white tracking-widest">{leaderboard.length}</p>
          <p className="text-gray-500 text-xs font-poppins-semibold uppercase tracking-wider">Competidores</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-none p-4 text-center hover:border-red-500/30 transition-colors">
          <div className="flex justify-center mb-2">
            <Target className="w-6 h-6 text-amber-500" />
          </div>
          <p className="text-2xl font-poppins-bold text-white tracking-widest">
            {leaderboard[0]?.total_points || 0}
          </p>
          <p className="text-gray-500 text-xs font-poppins-semibold uppercase tracking-wider">Puntos Máximos</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-none p-4 text-center hover:border-red-500/30 transition-colors">
          <div className="flex justify-center mb-2">
            <Flame className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-2xl font-poppins-bold text-white tracking-widest">
            {leaderboard.length > 0 ? Math.max(...leaderboard.map(e => e.current_streak)) : 0}
          </p>
          <p className="text-gray-500 text-xs font-poppins-semibold uppercase tracking-wider">Mejor Racha</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-none p-4 text-center hover:border-red-500/30 transition-colors">
          <div className="flex justify-center mb-2">
            <Zap className="w-6 h-6 text-amber-500" />
          </div>
          <p className="text-2xl font-poppins-bold text-white tracking-widest">
            {leaderboard.length > 0 ? Math.max(...leaderboard.map(e => e.level)) : 1}
          </p>
          <p className="text-gray-500 text-xs font-poppins-semibold uppercase tracking-wider">Nivel Máximo</p>
        </div>
      </motion.div>

      {/* Tabla de líderes */}
      <div className="bg-stone-900 rounded-none border border-stone-800 shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-amber-500/50"></div>
        <div className="p-6">
          <h2 className="text-xl font-poppins-bold uppercase tracking-widest text-white mb-6 flex items-center">
            <Trophy className="w-5 h-5 text-amber-500 mr-3" />
            RANKING DE LÍDERES
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
                    whileHover={{ scale: 1.01, x: 5 }}
                    whileTap={{ scale: 0.99 }}
                    className={`relative group ${isCurrentUser
                      ? 'bg-stone-800 border-l-4 border-l-red-600 border-y border-r border-stone-700'
                      : 'bg-stone-800/50 hover:bg-stone-800 border-b border-stone-800 hover:border-red-500/20'
                      } p-4 transition-all duration-300`}
                  >
                    {/* Efecto de brillo en hover */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

                    <div className="relative flex items-center justify-between">
                      {/* Lado izquierdo - Ranking y usuario */}
                      <div className="flex items-center space-x-4">
                        {/* Badge de posición */}
                        <div className={`relative ${getRankBadge(position)} px-3 py-1 font-poppins-bold tracking-widest text-sm min-w-[60px] text-center shadow-lg`}>
                          {getRankIcon(position)}
                          <span className="ml-1">{getRankText(position)}</span>
                        </div>

                        {/* Información del usuario */}
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 ${position === 1 ? 'bg-amber-500 text-stone-900' :
                            position === 2 ? 'bg-gray-300 text-stone-900' :
                              position === 3 ? 'bg-amber-700 text-white' :
                                'bg-stone-700 text-white border border-stone-600'
                            } flex items-center justify-center shadow-inner`}>
                            <span className="font-poppins-bold text-sm">
                              {entry.username ? entry.username.charAt(0).toUpperCase() : 'U'}
                            </span>
                          </div>
                          <div>
                            <p className="font-poppins-bold tracking-wide text-white uppercase text-sm">
                              {entry.username || `Usuario ${entry.user_id.slice(0, 8)}...`}
                              {isCurrentUser && (
                                <span className="ml-2 text-[10px] bg-red-600 text-white px-2 py-0.5 uppercase tracking-widest shadow-sm shadow-red-900/50">
                                  TÚ
                                </span>
                              )}
                            </p>
                            <div className="flex items-center space-x-2 text-xs font-poppins-medium mt-0.5">
                              <span className="text-gray-500">Nivel {entry.level}</span>
                              <span className="text-gray-600">•</span>
                              <span className="text-red-400 uppercase tracking-widest">{entry.rank}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Lado derecho - Estadísticas */}
                      <div className="flex items-center space-x-6 mr-2">
                        {/* Puntos */}
                        <div className="text-right">
                          <p className="text-xl font-poppins-extrabold text-amber-500 tracking-wider">
                            {entry.total_points.toLocaleString()}
                          </p>
                          <p className="text-gray-600 text-[10px] font-poppins-bold uppercase tracking-widest">XP</p>
                        </div>

                        {/* Racha */}
                        <div className="text-right">
                          <div className="flex items-center justify-end space-x-1">
                            <Flame className="w-4 h-4 text-red-500" />
                            <p className="font-poppins-bold text-white tracking-widest">{entry.current_streak}</p>
                          </div>
                          <p className="text-gray-600 text-[10px] font-poppins-bold uppercase tracking-widest">Días</p>
                        </div>

                        {/* Sesiones */}
                        <div className="text-right">
                          <p className="font-poppins-bold text-white tracking-widest">{entry.total_sessions}</p>
                          <p className="text-gray-600 text-[10px] font-poppins-bold uppercase tracking-widest">Sesiones</p>
                        </div>
                      </div>
                    </div>

                    {/* Barra de progreso sutil */}
                    <div className="mt-4 h-1 bg-stone-900 overflow-hidden">
                      <motion.div
                        className="h-full bg-red-600"
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
          <div className="mt-6 pt-4 border-t border-stone-800 text-center">
            <p className="text-gray-500 text-xs font-poppins-light uppercase tracking-widest">
              Actualizado en tiempo real • {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardTable;
