import { useState, useEffect } from "react";
import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react";

import { challengeService, type LeaderboardEntry } from "@/lib/challengeService";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Crown, Medal, Star, TrendingUp, Zap, Target, Flame } from "lucide-react";

const LeaderboardTable = () => {
  console.log('🎯 LeaderboardTable: Componente renderizado');
  const supabase = useSupabaseClient();
  const user = useUser();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      console.log('🔍 LeaderboardTable: Iniciando carga de datos...');
      setIsLoading(true);
      try {
        console.log('📡 LeaderboardTable: Llamando a challengeService.getLeaderboard...');
        const leaderboardData = await challengeService.getLeaderboard(10);
        console.log('✅ LeaderboardTable: Datos recibidos:', leaderboardData);
        setLeaderboard(leaderboardData);
      } catch (error) {
        console.error("❌ LeaderboardTable: Error al obtener la tabla de líderes:", error);
      } finally {
        setIsLoading(false);
        console.log('🏁 LeaderboardTable: Carga completada');
      }
    };

    fetchLeaderboard();

    // Suscripción para actualizaciones en tiempo real
    const subscription = supabase
      .channel("public:leaderboard")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "leaderboard",
        },
        fetchLeaderboard
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-300" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return <Star className="w-4 h-4 text-blue-400" />;
    }
  };

  const getRankBadge = (position: number) => {
    switch (position) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-orange-500 text-black";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800";
      case 3:
        return "bg-gradient-to-r from-amber-600 to-yellow-600 text-white";
      default:
        return "bg-gradient-to-r from-blue-500 to-purple-600 text-white";
    }
  };

  const getRankText = (position: number) => {
    switch (position) {
      case 1:
        return "🥇 CAMPEÓN";
      case 2:
        return "🥈 SEGUNDO";
      case 3:
        return "🥉 TERCERO";
      default:
        return `#${position}`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" style={{ animationDelay: '-0.5s' }}></div>
          </div>
          <p className="text-gray-400 font-medium">Cargando líderes...</p>
          <p className="text-gray-500 text-sm">Preparando la competencia</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header con efecto de gradiente */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-2xl blur-xl opacity-20"></div>
          <div className="relative bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="flex items-center justify-center mb-4">
              <div className="relative">
                <Trophy className="w-12 h-12 text-yellow-400" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">
              Tabla de Líderes
            </h1>
            <p className="text-gray-400">
              Los mejores atletas de Pichasafio
            </p>
          </div>
        </div>
      </motion.div>

      {/* Estadísticas rápidas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <div className="bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-xl p-4 text-center">
          <div className="flex justify-center mb-2">
            <TrendingUp className="w-6 h-6 text-pink-400" />
          </div>
          <p className="text-2xl font-bold text-white">{leaderboard.length}</p>
          <p className="text-gray-400 text-sm">Competidores</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-4 text-center">
          <div className="flex justify-center mb-2">
            <Target className="w-6 h-6 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {leaderboard[0]?.total_points || 0}
          </p>
          <p className="text-gray-400 text-sm">Puntos Máximos</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4 text-center">
          <div className="flex justify-center mb-2">
            <Flame className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {Math.max(...leaderboard.map(e => e.current_streak), 0)}
          </p>
          <p className="text-gray-400 text-sm">Mejor Racha</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4 text-center">
          <div className="flex justify-center mb-2">
            <Zap className="w-6 h-6 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {Math.max(...leaderboard.map(e => e.level), 1)}
          </p>
          <p className="text-gray-400 text-sm">Nivel Máximo</p>
        </div>
      </motion.div>

      {/* Tabla de líderes moderna */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-blue-500/5 rounded-2xl blur-xl"></div>
        <div className="relative bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
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
                          ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30' 
                          : 'bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50'
                      } rounded-xl p-4 transition-all duration-300`}
                    >
                      {/* Efecto de brillo en hover */}
                      <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 via-purple-500/0 to-blue-500/0 group-hover:from-pink-500/5 group-hover:via-purple-500/5 group-hover:to-blue-500/5 rounded-xl transition-all duration-500"></div>
                      
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
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {entry.username ? entry.username.charAt(0).toUpperCase() : 'U'}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-white">
                                {entry.username || `Usuario ${entry.user_id.slice(0, 8)}...`}
                                {isCurrentUser && (
                                  <span className="ml-2 text-xs bg-pink-500 text-white px-2 py-1 rounded-full">
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
                            <p className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                              {entry.total_points.toLocaleString()}
                            </p>
                            <p className="text-gray-400 text-sm">XP</p>
                          </div>
                          
                          {/* Racha */}
                          <div className="text-right">
                            <div className="flex items-center space-x-1">
                              <Flame className="w-4 h-4 text-orange-400" />
                              <p className="font-semibold text-white">{entry.current_streak}</p>
                            </div>
                            <p className="text-gray-400 text-xs">días</p>
                          </div>
                          
                          {/* Sesiones */}
                          <div className="text-right">
                            <p className="font-semibold text-white">{entry.total_sessions}</p>
                            <p className="text-gray-400 text-xs">sesiones</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Barra de progreso sutil */}
                      <div className="mt-3 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${(entry.total_points / Math.max(...leaderboard.map(e => e.total_points), 1)) * 100}%` }}
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
    </div>
  );
};

export default LeaderboardTable;
