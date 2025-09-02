import React, { useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { rewardsService, UserReward } from '../../lib/rewardsService';

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

  useEffect(() => {
    if (user?.id) {
      loadRewardsData();
    }
  }, [user?.id]);

  const loadRewardsData = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const [rewards, progress] = await Promise.all([
        rewardsService.getUserRewards(user.id),
        rewardsService.getRewardProgress(user.id)
      ]);
      
      setUserRewards(rewards);
      setRewardProgress(progress);
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
    if (points >= 1000) return 'text-yellow-400 border-yellow-400'; // Legendary
    if (points >= 500) return 'text-purple-400 border-purple-400'; // Epic
    if (points >= 200) return 'text-blue-400 border-blue-400'; // Rare
    return 'text-gray-400 border-gray-400'; // Common
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
      <div className="bg-gray-900 rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          🏆 Recompensas
        </h2>
        
        {/* Botones de simulación para testing */}
        <div className="flex gap-2">
          <button
            onClick={() => handleSimulatePoints(50)}
            disabled={isSimulating}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            +50 pts
          </button>
          <button
            onClick={() => handleSimulatePoints(100)}
            disabled={isSimulating}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 disabled:opacity-50"
          >
            +100 pts
          </button>
          <button
            onClick={() => handleSimulatePoints(200)}
            disabled={isSimulating}
            className="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 disabled:opacity-50"
          >
            +200 pts
          </button>
        </div>
      </div>

      {/* Recompensas obtenidas */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          ✨ Logros Desbloqueados ({userRewards.length})
        </h3>
        
        {userRewards.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userRewards.map((userReward) => (
              <div
                key={userReward.id}
                className={`bg-gray-800 rounded-lg p-4 border-2 ${getRewardColor(userReward.achievement?.points_reward || 0)}`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{userReward.achievement?.icon}</span>
                  <div>
                    <h4 className="font-semibold text-white">{userReward.achievement?.name}</h4>
                    <p className="text-sm text-gray-400">{userReward.achievement?.description}</p>
                  </div>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-400">+{userReward.achievement?.points_reward} pts</span>
                  <span className="text-gray-500">
                    {new Date(userReward.earned_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <span className="text-4xl mb-2 block">🎯</span>
            <p>¡Aún no has desbloqueado ningún logro!</p>
            <p className="text-sm">Sigue practicando para ganar tus primeras recompensas</p>
          </div>
        )}
      </div>

      {/* Progreso hacia próximas recompensas */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          🎯 Próximos Logros
        </h3>
        
        {rewardProgress.length > 0 ? (
          <div className="space-y-4">
            {rewardProgress.map((progress) => (
              <div key={progress.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{progress.icon}</span>
                    <div>
                      <h4 className="font-semibold text-white">{progress.name}</h4>
                      <p className="text-sm text-gray-400">{progress.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-400 font-semibold">+{progress.points_reward} pts</div>
                    <div className="text-sm text-gray-400">
                      {getRequirementText(progress.requirement_type, progress.requirement_value)}
                    </div>
                  </div>
                </div>
                
                <div className="mt-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">
                      {progress.currentValue} / {progress.requirement_value}
                    </span>
                    <span className="text-gray-400">
                      {Math.round(progress.progressPercentage)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(progress.progressPercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400">
            <span className="text-4xl mb-2 block">🏁</span>
            <p>¡Has desbloqueado todos los logros disponibles!</p>
            <p className="text-sm">Mantente atento a nuevas recompensas</p>
          </div>
        )}
      </div>
      
      {isSimulating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <div className="animate-spin text-4xl mb-4">⚡</div>
            <p className="text-white">Procesando puntos...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RewardsPanel;