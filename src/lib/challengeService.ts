import { supabase } from './supabaseClient';

export interface UserChallenge {
  id: string;
  user_id: string;
  challenge_type: string;
  current_day: number;
  total_days: number;
  completed_days: number;
  streak_days: number;
  last_completed_date: string | null;
  start_date: string;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DailyProgress {
  id: string;
  user_id: string;
  challenge_id: string;
  day_number: number;
  exercise_name: string;
  completed_at: string;
  video_watched: boolean;
  ad_watched: boolean;
  points_earned: number;
  notes?: string;
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  user_id: string;
  username?: string;
  total_points: number;
  level: number;
  rank: string;
  challenges_completed: number;
  current_streak: number;
  longest_streak: number;
  last_activity: string;
  achievements: any[];
  created_at: string;
  updated_at: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  points_reward: number;
  requirement_type: string;
  requirement_value: number;
  created_at: string;
}

class ChallengeService {
  // Obtener o crear el reto activo del usuario
  async getOrCreateUserChallenge(userId: string, challengeType: string): Promise<UserChallenge> {
    const { data: existingChallenge, error: fetchError } = await supabase
      .from('user_challenges')
      .select('*')
      .eq('user_id', userId)
      .eq('challenge_type', challengeType)
      .eq('is_active', true)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (existingChallenge) {
      return existingChallenge;
    }

    // Crear nuevo reto
    const { data: newChallenge, error: insertError } = await supabase
      .from('user_challenges')
      .insert({
        user_id: userId,
        challenge_type: challengeType,
        current_day: 1,
        total_days: 30,
        completed_days: 0,
        streak_days: 0,
        start_date: new Date().toISOString(),
        is_active: true
      })
      .select()
      .single();

    if (insertError) {
      throw insertError;
    }

    return newChallenge;
  }

  // Verificar si un día está desbloqueado
  async isDayUnlocked(userId: string, challengeType: string, dayNumber: number): Promise<boolean> {
    const challenge = await this.getOrCreateUserChallenge(userId, challengeType);
    
    // El día está desbloqueado si es el día actual o anterior
    return dayNumber <= challenge.current_day;
  }

  // Completar un día del reto
  async completeDay(userId: string, challengeType: string, dayNumber: number, exerciseName: string, adWatched: boolean = false): Promise<DailyProgress> {
    const challenge = await this.getOrCreateUserChallenge(userId, challengeType);

    // Verificar que el día esté desbloqueado
    if (dayNumber > challenge.current_day) {
      throw new Error('Este día aún no está desbloqueado');
    }

    // Verificar que no se haya completado ya
    const { data: existingProgress } = await supabase
      .from('daily_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('challenge_id', challenge.id)
      .eq('day_number', dayNumber)
      .single();

    if (existingProgress) {
      throw new Error('Este día ya fue completado');
    }

    // Calcular puntos (más puntos si vio el anuncio)
    const pointsEarned = adWatched ? 15 : 10;

    // Registrar progreso diario
    const { data: progress, error: progressError } = await supabase
      .from('daily_progress')
      .insert({
        user_id: userId,
        challenge_id: challenge.id,
        day_number: dayNumber,
        exercise_name: exerciseName,
        video_watched: true,
        ad_watched: adWatched,
        points_earned: pointsEarned
      })
      .select()
      .single();

    if (progressError) {
      throw progressError;
    }

    // Actualizar el reto del usuario
    const today = new Date();
    const lastCompleted = challenge.last_completed_date ? new Date(challenge.last_completed_date) : null;
    
    // Calcular racha
    let newStreak = challenge.streak_days;
    if (!lastCompleted || this.isConsecutiveDay(lastCompleted, today)) {
      newStreak += 1;
    } else {
      newStreak = 1;
    }

    // Actualizar el reto
    const { error: updateError } = await supabase
      .from('user_challenges')
      .update({
        completed_days: challenge.completed_days + 1,
        streak_days: newStreak,
        last_completed_date: today.toISOString(),
        current_day: Math.max(challenge.current_day, dayNumber + 1),
        end_date: challenge.completed_days + 1 >= challenge.total_days ? today.toISOString() : null,
        is_active: challenge.completed_days + 1 < challenge.total_days
      })
      .eq('id', challenge.id);

    if (updateError) {
      throw updateError;
    }

    // Actualizar leaderboard
    await this.updateLeaderboard(userId, pointsEarned);

    // Verificar logros
    await this.checkAndAwardAchievements(userId);

    return progress;
  }

  // Obtener progreso del usuario
  async getUserProgress(userId: string, challengeType: string): Promise<{
    challenge: UserChallenge;
    progress: DailyProgress[];
  }> {
    const challenge = await this.getOrCreateUserChallenge(userId, challengeType);

    const { data: progress, error } = await supabase
      .from('daily_progress')
      .select('*')
      .eq('challenge_id', challenge.id)
      .order('day_number', { ascending: true });

    if (error) {
      throw error;
    }

    return {
      challenge,
      progress: progress || []
    };
  }

  // Actualizar leaderboard
  async updateLeaderboard(userId: string, pointsToAdd: number): Promise<void> {
    // Obtener entrada actual del leaderboard
    const { data: currentEntry } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('user_id', userId)
      .single();

    const newPoints = (currentEntry?.total_points || 0) + pointsToAdd;
    const newLevel = Math.floor(newPoints / 100) + 1;

    if (currentEntry) {
      // Actualizar entrada existente
      await supabase
        .from('leaderboard')
        .update({
          total_points: newPoints,
          level: newLevel,
          last_activity: new Date().toISOString()
        })
        .eq('user_id', userId);
    } else {
      // Crear nueva entrada
      await supabase
        .from('leaderboard')
        .insert({
          user_id: userId,
          total_points: newPoints,
          level: newLevel,
          rank: this.calculateRank(newPoints),
          last_activity: new Date().toISOString()
        });
    }
  }

  // Obtener leaderboard
  async getLeaderboard(limit: number = 10): Promise<LeaderboardEntry[]> {
    const { data, error } = await supabase
      .from('leaderboard')
      .select('*')
      .order('total_points', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return data || [];
  }

  // Verificar y otorgar logros
  async checkAndAwardAchievements(userId: string): Promise<void> {
    // Obtener datos del usuario
    const { data: leaderboardEntry } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('user_id', userId)
      .single();

    const { data: userChallenges } = await supabase
      .from('user_challenges')
      .select('*')
      .eq('user_id', userId);

    if (!leaderboardEntry || !userChallenges) return;

    // Obtener logros disponibles
    const { data: achievements } = await supabase
      .from('achievements')
      .select('*');

    if (!achievements) return;

    // Obtener logros ya otorgados
    const { data: userAchievements } = await supabase
      .from('user_achievements')
      .select('achievement_id')
      .eq('user_id', userId);

    const earnedAchievementIds = userAchievements?.map(ua => ua.achievement_id) || [];

    // Verificar cada logro
    for (const achievement of achievements) {
      if (earnedAchievementIds.includes(achievement.id)) continue;

      let shouldAward = false;

      switch (achievement.requirement_type) {
        case 'points':
          shouldAward = leaderboardEntry.total_points >= achievement.requirement_value;
          break;
        case 'streak':
          shouldAward = userChallenges.some(uc => uc.streak_days >= achievement.requirement_value);
          break;
        case 'challenges':
          const completedChallenges = userChallenges.filter(uc => !uc.is_active).length;
          shouldAward = completedChallenges >= achievement.requirement_value;
          break;
      }

      if (shouldAward) {
        // Otorgar logro
        await supabase
          .from('user_achievements')
          .insert({
            user_id: userId,
            achievement_id: achievement.id
          });

        // Añadir puntos del logro
        await this.updateLeaderboard(userId, achievement.points_reward);
      }
    }
  }

  // Utilidades
  private isConsecutiveDay(lastDate: Date, currentDate: Date): boolean {
    const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 1;
  }

  private calculateRank(points: number): string {
    if (points >= 1000) return 'Maestro';
    if (points >= 500) return 'Experto';
    if (points >= 200) return 'Intermedio';
    if (points >= 50) return 'Principiante';
    return 'Novato';
  }

  // Obtener logros del usuario
  async getUserAchievements(userId: string): Promise<Achievement[]> {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        achievement_id,
        achievements (*)
      `)
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    return data?.map(item => item.achievements).filter(Boolean) || [];
  }
}

export const challengeService = new ChallengeService();
