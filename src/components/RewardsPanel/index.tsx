import React, { useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { rewardsService, UserReward } from '../../lib/rewardsService';
import { Gift, Trophy, Star, Target } from 'lucide-react';

interface RewardProgress {
  id: string;
  name: string;
  description: string;
  icon: string;
  points_reward: number;
  requirement_type: string;
  requirement_value: number;
  currentValue: number;
  progressPercentage: number;
  isCompleted: boolean;
}

const RewardsPanel: React.FC = () => {
  const user = useUser();
  const [userRewards, setUserRewards] = useState<UserReward[]>([]);
  const [rewardProgress, setRewardProgress] = useState<RewardProgress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [discount, setDiscount] = useState<{ percent: number; totalPoints: number }>({ percent: 0, totalPoints: 0 });

  useEffect(() => {
    if (user?.id) {
      loadRewardsData();
    }
  }, [user?.id]);

  const loadRewardsData = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const [rewards, progress, discountData] = await Promise.all([
        rewardsService.getUserRewards(user.id),
        rewardsService.getRewardProgress(user.id),
        rewardsService.getUserDiscount(user.id)
      ]);

      setUserRewards(rewards);
      setRewardProgress(progress);
      setDiscount(discountData);
    } catch (error) {
      console.error('Error cargando datos de recompensas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulatePoints = async (points: number) => {
    if (!user?.id || isSimulating) return;

    setIsSimulating(true);
    try {
      await rewardsService.simulateEarnPoints(user.id, points);
      // Recargar datos después de la simulación
      await loadRewardsData();
    } catch (error) {
      console.error('Error simulando puntos:', error);
    } finally {
      setIsSimulating(false);
    }
  };

  const getRewardColor = (points: number) => {
    if (points >= 1000) return 'text-amber-500 border-amber-500 shadow-lg shadow-amber-500/20'; // Legendary
    if (points >= 500) return 'text-red-500 border-red-500 shadow-lg shadow-red-500/20'; // Epic
    if (points >= 200) return 'text-orange-500 border-orange-500'; // Rare
    return 'text-stone-400 border-stone-600'; // Common
  };

  const getRequirementText = (type: string, value: number) => {
    switch (type) {
      case 'level': return `Nivel ${value}`;
      case 'points': return `${value} puntos`;
      case 'streak': return `${value} días de racha`;
      case 'sessions': return `${value} sesiones`;
      default: return `${value}`;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-stone-900 rounded-none p-6 border border-stone-800 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
        <div className="animate-pulse">
          <div className="h-6 bg-stone-800 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-stone-800 rounded border border-stone-700"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-stone-900 rounded-none p-6 border border-stone-800 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-1 h-full bg-red-600"></div>
      <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
        <h2 className="text-2xl font-poppins-extrabold uppercase tracking-tight text-white flex items-center gap-2">
          <Trophy className="w-6 h-6 text-amber-500" />
          RECOMPENSAS
        </h2>

        {/* Simulate buttons - dev only */}
        {import.meta.env.DEV && (
          <div className="flex gap-2 bg-stone-800 p-2 border border-stone-700">
            <button
              onClick={() => handleSimulatePoints(50)}
              disabled={isSimulating}
              className="px-3 py-1 bg-stone-700 text-white rounded-none text-xs font-poppins-bold uppercase hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              +50 pts
            </button>
            <button
              onClick={() => handleSimulatePoints(100)}
              disabled={isSimulating}
              className="px-3 py-1 bg-stone-700 text-white rounded-none text-xs font-poppins-bold uppercase hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              +100 pts
            </button>
            <button
              onClick={() => handleSimulatePoints(200)}
              disabled={isSimulating}
              className="px-3 py-1 bg-stone-700 text-white rounded-none text-xs font-poppins-bold uppercase hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              +200 pts
            </button>
          </div>
        )}
      </div>

      {/* XP Discount Banner */}
      {discount.percent > 0 && (
        <div className="mb-8 bg-stone-800/80 border border-amber-500/30 rounded-none p-5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <Gift className="w-10 h-10 text-amber-500 shrink-0" />
            <div>
              <h3 className="text-lg font-poppins-bold uppercase tracking-wider text-amber-400 mb-1">
                ¡TIENES UN {discount.percent}% DE DESCUENTO!
              </h3>
              <p className="text-sm text-gray-400 font-poppins-medium">
                Con <span className="text-white font-poppins-bold">{discount.totalPoints.toLocaleString()} XP</span> has desbloqueado un descuento exclusivo en guías.
                {discount.percent < 30 && (
                  <span className="text-amber-500 ml-1 font-poppins-semibold uppercase text-xs block mt-1">
                    SIGUIENTE NIVEL: {discount.percent === 10 ? '1,000 XP = 20%' : '2,000 XP = 30%'}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Recompensas obtenidas */}
      <div className="mb-10">
        <h3 className="text-lg font-poppins-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2 border-b border-stone-800 pb-2">
          <Star className="w-5 h-5 text-amber-500" />
          LOGROS DESBLOQUEADOS ({userRewards.length})
        </h3>

        {userRewards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userRewards.map((userReward) => (
              <div
                key={userReward.id}
                className={`bg-stone-800 rounded-none p-5 border-l-4 border-r border-y ${getRewardColor(userReward.achievement?.points_reward || 0)} transition-all hover:bg-stone-800/80`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-3xl bg-stone-900 w-12 h-12 flex items-center justify-center border border-stone-700">{userReward.achievement?.icon}</span>
                  <div>
                    <h4 className="font-poppins-bold uppercase tracking-wide text-white text-sm">{userReward.achievement?.name}</h4>
                    <p className="text-xs text-gray-400 font-poppins-medium mt-1 uppercase">{userReward.achievement?.description}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-xs mt-4 pt-3 border-t border-stone-700/50">
                  <span className="text-red-500 font-poppins-bold tracking-widest uppercase">+{userReward.achievement?.points_reward} pts</span>
                  <span className="text-gray-500 font-poppins-medium">
                    {new Date(userReward.earned_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-stone-800 border border-stone-700 p-6">
            <span className="text-5xl mb-4 block">🎯</span>
            <p className="text-white font-poppins-bold uppercase tracking-wider">¡AÚN NO HAS DESBLOQUEADO NINGÚN LOGRO!</p>
            <p className="text-sm text-gray-400 font-poppins-medium mt-2">Sigue practicando para ganar tus primeras recompensas.</p>
          </div>
        )}
      </div>

      {/* Progreso hacia próximas recompensas */}
      <div>
        <h3 className="text-lg font-poppins-bold uppercase tracking-widest text-white mb-6 flex items-center gap-2 border-b border-stone-800 pb-2">
          <Target className="w-5 h-5 text-red-500" />
          PRÓXIMOS LOGROS
        </h3>

        {rewardProgress.length > 0 ? (
          <div className="space-y-4">
            {rewardProgress.map((progress) => (
              <div key={progress.id} className="bg-stone-800 rounded-none border border-stone-700 p-5 hover:border-red-500/30 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl bg-stone-900 w-12 h-12 flex items-center justify-center border border-stone-700">{progress.icon}</span>
                    <div>
                      <h4 className="font-poppins-bold uppercase tracking-wide text-white text-sm">{progress.name}</h4>
                      <p className="text-xs text-gray-400 font-poppins-medium mt-1 uppercase">{progress.description}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right border-t sm:border-t-0 border-stone-700 pt-3 sm:pt-0">
                    <div className="text-red-500 font-poppins-bold tracking-widest uppercase text-sm">+{progress.points_reward} pts</div>
                    <div className="text-xs text-gray-500 font-poppins-bold uppercase mt-1">
                      {getRequirementText(progress.requirement_type, progress.requirement_value)}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="flex justify-between text-xs font-poppins-medium uppercase mb-2">
                    <span className="text-gray-400">
                      Progreso: <span className="text-white font-poppins-bold">{progress.currentValue} / {progress.requirement_value}</span>
                    </span>
                    <span className="text-amber-500 font-poppins-bold">
                      {Math.round(progress.progressPercentage)}%
                    </span>
                  </div>
                  <div className="w-full bg-stone-900 rounded-none h-2 border border-stone-700 overflow-hidden">
                    <div
                      className="bg-red-600 h-full transition-all duration-500 ease-out"
                      style={{ width: `${Math.min(progress.progressPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-stone-800 border border-stone-700 p-6">
            <span className="text-5xl mb-4 block">🏁</span>
            <p className="text-white font-poppins-bold uppercase tracking-wider">¡HAS DESBLOQUEADO TODOS LOS LOGROS!</p>
            <p className="text-sm text-gray-400 font-poppins-medium mt-2">Mantente alerta a nuevas recompensas muy pronto.</p>
          </div>
        )}
      </div>

      {isSimulating && (
        <div className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-stone-900 border border-stone-800 rounded-none p-8 text-center max-w-sm w-full mx-4 shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600 animate-pulse"></div>
            <div className="animate-spin text-5xl mb-6">⚡</div>
            <p className="text-white font-poppins-bold uppercase tracking-widest">Enviando Datos</p>
            <p className="text-gray-400 text-xs font-poppins-medium mt-2">Sincronizando con base de datos...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsPanel;