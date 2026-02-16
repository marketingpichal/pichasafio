import { supabase } from './supabaseClient';

export interface Reward {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement_type: 'level' | 'points' | 'streak' | 'sessions';
  requirement_value: number;
  points_reward: number;
}

export interface UserReward {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  achievement?: Reward;
}

class RewardsService {
  // Recompensas predefinidas basadas en niveles y puntos
  private readonly LEVEL_REWARDS: Reward[] = [
    {
      id: 'level_2',
      name: 'Primer Paso',
      description: 'Alcanzaste el nivel 2',
      icon: '🌱',
      points_reward: 50,
      requirement_type: 'level',
      requirement_value: 2
    },
    {
      id: 'level_5',
      name: 'En Crecimiento',
      description: 'Alcanzaste el nivel 5',
      icon: '🌿',
      points_reward: 100,
      requirement_type: 'level',
      requirement_value: 5
    },
    {
      id: 'level_10',
      name: 'Dedicado',
      description: 'Alcanzaste el nivel 10',
      icon: '🌳',
      points_reward: 200,
      requirement_type: 'level',
      requirement_value: 10
    },
    {
      id: 'level_15',
      name: 'Experto',
      description: 'Alcanzaste el nivel 15',
      icon: '🏆',
      points_reward: 300,
      requirement_type: 'level',
      requirement_value: 15
    },
    {
      id: 'level_20',
      name: 'Maestro',
      description: 'Alcanzaste el nivel 20',
      icon: '👑',
      points_reward: 500,
      requirement_type: 'level',
      requirement_value: 20
    },
    {
      id: 'points_500',
      name: 'Coleccionista',
      description: 'Acumulaste 500 puntos',
      icon: '💎',
      points_reward: 100,
      requirement_type: 'points',
      requirement_value: 500
    },
    {
      id: 'points_1000',
      name: 'Millonario',
      description: 'Acumulaste 1000 puntos',
      icon: '💰',
      points_reward: 200,
      requirement_type: 'points',
      requirement_value: 1000
    },
    {
      id: 'streak_7',
      name: 'Constante',
      description: 'Mantuviste una racha de 7 días',
      icon: '🔥',
      points_reward: 150,
      requirement_type: 'streak',
      requirement_value: 7
    },
    {
      id: 'streak_30',
      name: 'Imparable',
      description: 'Mantuviste una racha de 30 días',
      icon: '⚡',
      points_reward: 500,
      requirement_type: 'streak',
      requirement_value: 30
    }
  ];

  // Inicializar recompensas en la base de datos
  async initializeRewards(): Promise<void> {
    try {
      console.log('🎁 Inicializando sistema de recompensas...');
      
      for (const reward of this.LEVEL_REWARDS) {
        // Verificar si ya existe
        const { data: existing } = await supabase
          .from('achievements')
          .select('id')
          .eq('id', reward.id)
          .single();
        
        if (!existing) {
          // Insertar nueva recompensa
          const { error } = await supabase
            .from('achievements')
            .insert({
              id: reward.id,
              name: reward.name,
              description: reward.description,
              icon: reward.icon,
              points_reward: reward.points_reward,
              requirement_type: reward.requirement_type,
              requirement_value: reward.requirement_value
            });
          
          if (error) {
            console.error(`Error insertando recompensa ${reward.name}:`, error.message);
          } else {
            console.log(`✅ Recompensa ${reward.name} inicializada`);
          }
        }
      }
      
      console.log('🎉 Sistema de recompensas inicializado!');
    } catch (error) {
      console.error('Error inicializando recompensas:', error);
    }
  }

  // Verificar y otorgar recompensas para un usuario
  async checkAndAwardRewards(userId: string): Promise<UserReward[]> {
    try {
      // Obtener datos actuales del usuario
      const { data: leaderboardEntry } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (!leaderboardEntry) {
        console.log('Usuario no encontrado en leaderboard');
        return [];
      }
      
      // Obtener recompensas ya otorgadas
      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId);
      
      const earnedIds = userAchievements?.map(ua => ua.achievement_id) || [];
      
      // Obtener todas las recompensas disponibles
      const { data: availableRewards } = await supabase
        .from('achievements')
        .select('*');
      
      if (!availableRewards) return [];
      
      const newRewards: UserReward[] = [];
      
      // Verificar cada recompensa
      for (const reward of availableRewards) {
        if (earnedIds.includes(reward.id)) continue;
        
        let shouldAward = false;
        
        switch (reward.requirement_type) {
          case 'level':
            shouldAward = leaderboardEntry.level >= reward.requirement_value;
            break;
          case 'points':
            shouldAward = leaderboardEntry.total_points >= reward.requirement_value;
            break;
          case 'streak':
            shouldAward = leaderboardEntry.current_streak >= reward.requirement_value;
            break;
          case 'sessions':
            shouldAward = leaderboardEntry.total_sessions >= reward.requirement_value;
            break;
        }
        
        if (shouldAward) {
          // Otorgar recompensa
          const { data: newUserReward, error } = await supabase
            .from('user_achievements')
            .insert({
              user_id: userId,
              achievement_id: reward.id
            })
            .select('*')
            .single();
          
          if (!error && newUserReward) {
            // Agregar puntos bonus
            await this.addBonusPoints(userId, reward.points_reward);
            
            newRewards.push({
              ...newUserReward,
              achievement: reward
            });
            
            console.log(`🎉 Recompensa otorgada: ${reward.name} a usuario ${userId}`);
          }
        }
      }
      
      return newRewards;
    } catch (error) {
      console.error('Error verificando recompensas:', error);
      return [];
    }
  }

  // Agregar puntos bonus por recompensas
  private async addBonusPoints(userId: string, bonusPoints: number): Promise<void> {
    try {
      const { data: currentEntry } = await supabase
        .from('leaderboard')
        .select('total_points, level')
        .eq('user_id', userId)
        .single();
      
      if (currentEntry) {
        const newPoints = currentEntry.total_points + bonusPoints;
        const newLevel = Math.floor(newPoints / 100) + 1;
        
        await supabase
          .from('leaderboard')
          .update({
            total_points: newPoints,
            level: newLevel,
            last_activity: new Date().toISOString()
          })
          .eq('user_id', userId);
        
        console.log(`💰 ${bonusPoints} puntos bonus agregados a usuario ${userId}`);
      }
    } catch (error) {
      console.error('Error agregando puntos bonus:', error);
    }
  }

  // Obtener recompensas del usuario
  async getUserRewards(userId: string): Promise<UserReward[]> {
    try {
      const { data, error } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievements (*)
        `)
        .eq('user_id', userId)
        .order('earned_at', { ascending: false });
      
      if (error) {
        console.error('Error obteniendo recompensas del usuario:', error);
        return [];
      }
      
      return data?.map(item => ({
        ...item,
        achievement: item.achievements
      })) || [];
    } catch (error) {
      console.error('Error obteniendo recompensas:', error);
      return [];
    }
  }

  // Obtener progreso hacia próximas recompensas
  async getRewardProgress(userId: string): Promise<any[]> {
    try {
      const { data: leaderboardEntry } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (!leaderboardEntry) return [];
      
      const { data: userAchievements } = await supabase
        .from('user_achievements')
        .select('achievement_id')
        .eq('user_id', userId);
      
      const earnedIds = userAchievements?.map(ua => ua.achievement_id) || [];
      
      const { data: availableRewards } = await supabase
        .from('achievements')
        .select('*')
        .order('requirement_value');
      
      if (!availableRewards) return [];
      
      return availableRewards
        .filter(reward => !earnedIds.includes(reward.id))
        .map(reward => {
          let currentValue = 0;
          let progressPercentage = 0;
          
          switch (reward.requirement_type) {
            case 'level':
              currentValue = leaderboardEntry.level;
              break;
            case 'points':
              currentValue = leaderboardEntry.total_points;
              break;
            case 'streak':
              currentValue = leaderboardEntry.current_streak;
              break;
            case 'sessions':
              currentValue = leaderboardEntry.total_sessions;
              break;
          }
          
          progressPercentage = Math.min((currentValue / reward.requirement_value) * 100, 100);
          
          return {
            ...reward,
            currentValue,
            progressPercentage,
            isCompleted: progressPercentage >= 100
          };
        })
        .slice(0, 5); // Mostrar solo las próximas 5 recompensas
    } catch (error) {
      console.error('Error obteniendo progreso de recompensas:', error);
      return [];
    }
  }

  // Get XP-based discount percentage
  getXPDiscount(totalPoints: number): { percent: number; label: string } {
    if (totalPoints >= 2000) return { percent: 30, label: '30%' };
    if (totalPoints >= 1000) return { percent: 20, label: '20%' };
    if (totalPoints >= 500) return { percent: 10, label: '10%' };
    return { percent: 0, label: '' };
  }

  // Get user's current XP discount from DB
  async getUserDiscount(userId: string): Promise<{ percent: number; totalPoints: number }> {
    try {
      const { data } = await supabase
        .from('leaderboard')
        .select('total_points')
        .eq('user_id', userId)
        .single();

      if (!data) return { percent: 0, totalPoints: 0 };

      const { percent } = this.getXPDiscount(data.total_points);
      return { percent, totalPoints: data.total_points };
    } catch {
      return { percent: 0, totalPoints: 0 };
    }
  }

  // Simular ganar puntos (para testing)
  async simulateEarnPoints(userId: string, points: number): Promise<void> {
    try {
      const { data: currentEntry } = await supabase
        .from('leaderboard')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (currentEntry) {
        const newPoints = currentEntry.total_points + points;
        const newLevel = Math.floor(newPoints / 100) + 1;
        const newSessions = currentEntry.total_sessions + 1;
        
        await supabase
          .from('leaderboard')
          .update({
            total_points: newPoints,
            level: newLevel,
            total_sessions: newSessions,
            last_activity: new Date().toISOString()
          })
          .eq('user_id', userId);
        
        console.log(`🎯 Simulación: ${points} puntos agregados. Nuevo total: ${newPoints} (Nivel ${newLevel})`);
        
        // Verificar nuevas recompensas
        const newRewards = await this.checkAndAwardRewards(userId);
        if (newRewards.length > 0) {
          console.log(`🎉 ¡${newRewards.length} nueva(s) recompensa(s) desbloqueada(s)!`);
        }
      }
    } catch (error) {
      console.error('Error simulando puntos:', error);
    }
  }
}

export const rewardsService = new RewardsService();