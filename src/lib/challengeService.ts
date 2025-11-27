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
  challenge_data: any; // Datos específicos del reto
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
  session_duration: number; // Duración en minutos
  session_data: any; // Datos específicos de la sesión
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
  total_sessions: number;
  total_minutes: number;
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
  challenge_type?: string; // NULL para logros generales, o tipo específico
  created_at: string;
}

export interface ChallengeStats {
  id: string;
  user_id: string;
  challenge_type: string;
  total_sessions: number;
  total_minutes: number;
  best_streak: number;
  current_streak: number;
  last_session_date: string | null;
  created_at: string;
  updated_at: string;
}

// Tipos de retos disponibles
export type ChallengeType = 'chochasafio' | '30_days' | 'respiration' | 'keguel' | 'routines';

class ChallengeService {
  // Obtener o crear el reto activo del usuario
  async getOrCreateUserChallenge(userId: string, challengeType: string): Promise<UserChallenge> {
    // Primero, buscar cualquier reto activo
    const { data: activeChallenges, error: fetchError } = await supabase
      .from('user_challenges')
      .select('*')
      .eq('user_id', userId)
      .eq('challenge_type', challengeType)
      .eq('is_active', true);

    if (fetchError) {
      throw fetchError;
    }

    // Si hay retos activos, usar el más reciente
    if (activeChallenges && activeChallenges.length > 0) {
      // Ordenar por fecha de creación y usar el más reciente
      const sortedChallenges = activeChallenges.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      return sortedChallenges[0];
    }

    // Si no hay retos activos, buscar cualquier reto existente
    const { data: existingChallenges, error: existingError } = await supabase
      .from('user_challenges')
      .select('*')
      .eq('user_id', userId)
      .eq('challenge_type', challengeType);

    if (existingError) {
      throw existingError;
    }

    // Si hay retos existentes pero inactivos, reactivar el más reciente
    if (existingChallenges && existingChallenges.length > 0) {
      const sortedChallenges = existingChallenges.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      const mostRecent = sortedChallenges[0];
      
      // Reactivar el reto más reciente
      const { error: reactivateError } = await supabase
        .from('user_challenges')
        .update({ is_active: true })
        .eq('id', mostRecent.id);

      if (reactivateError) {
        throw reactivateError;
      }

      return { ...mostRecent, is_active: true };
    }

    // Si no hay ningún reto, crear uno nuevo
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
  async isDayUnlocked(_userId: string, _challengeType: string, _dayNumber: number): Promise<boolean> {
    // Todos los días están desbloqueados para permitir acceso libre
    return true;
  }

  // Completar un día del reto
  async completeDay(
    userId: string, 
    challengeType: ChallengeType, 
    dayNumber: number, 
    exerciseName: string, 
    adWatched: boolean = false,
    sessionDuration: number = 0,
    sessionData: any = {}
  ): Promise<DailyProgress> {
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
        points_earned: pointsEarned,
        session_duration: sessionDuration,
        session_data: sessionData
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

    // Actualizar estadísticas del reto
    await this.updateChallengeStats(userId, challengeType, sessionDuration);

    // Actualizar leaderboard
    await this.updateLeaderboard(userId, pointsEarned);

    // Verificar logros
    await this.checkAndAwardAchievements(userId);

    return progress;
  }

  // Completar una sesión (para retos que no son diarios)
  async completeSession(
    userId: string,
    challengeType: ChallengeType,
    exerciseName: string,
    sessionDuration: number = 0,
    sessionData: any = {},
    adWatched: boolean = false
  ): Promise<DailyProgress> {
    const challenge = await this.getOrCreateUserChallenge(userId, challengeType);

    // Calcular puntos
    const pointsEarned = adWatched ? 15 : 10;

    // Registrar sesión
    const { data: progress, error: progressError } = await supabase
      .from('daily_progress')
      .insert({
        user_id: userId,
        challenge_id: challenge.id,
        day_number: challenge.completed_days + 1,
        exercise_name: exerciseName,
        video_watched: true,
        ad_watched: adWatched,
        points_earned: pointsEarned,
        session_duration: sessionDuration,
        session_data: sessionData
      })
      .select()
      .single();

    if (progressError) {
      throw progressError;
    }

    // Actualizar el reto
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
        current_day: challenge.current_day + 1
      })
      .eq('id', challenge.id);

    if (updateError) {
      throw updateError;
    }

    // Actualizar estadísticas del reto
    await this.updateChallengeStats(userId, challengeType, sessionDuration);

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

    // Obtener los usernames de los perfiles
    const userIds = (data || []).map(entry => entry.user_id);
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', userIds);

    // Crear un mapa de user_id -> username
    const usernameMap: { [key: string]: string | null } = {};
    profiles?.forEach(profile => {
      usernameMap[profile.id] = profile.username;
    });

    // Mapear los datos para incluir el username
    const leaderboardData = (data || []).map(entry => ({
      ...entry,
      username: usernameMap[entry.user_id] || null
    }));

    return leaderboardData;
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

    const { data: challengeStats } = await supabase
      .from('challenge_stats')
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
          if (achievement.challenge_type) {
            // Logro específico de un reto
            const challenge = userChallenges.find(uc => uc.challenge_type === achievement.challenge_type);
            shouldAward = challenge && challenge.streak_days >= achievement.requirement_value;
          } else {
            // Logro general de racha
            shouldAward = userChallenges.some(uc => uc.streak_days >= achievement.requirement_value);
          }
          break;
        case 'challenges':
          const completedChallenges = userChallenges.filter(uc => !uc.is_active).length;
          shouldAward = completedChallenges >= achievement.requirement_value;
          break;
        case 'sessions':
          if (achievement.challenge_type) {
            // Logro específico de sesiones de un reto
            const stats = challengeStats?.find(cs => cs.challenge_type === achievement.challenge_type);
            shouldAward = stats && stats.total_sessions >= achievement.requirement_value;
          } else {
            // Logro general de sesiones
            const totalSessions = challengeStats?.reduce((total, cs) => total + cs.total_sessions, 0) || 0;
            shouldAward = totalSessions >= achievement.requirement_value;
          }
          break;
        case 'minutes':
          if (achievement.challenge_type) {
            // Logro específico de minutos de un reto
            const stats = challengeStats?.find(cs => cs.challenge_type === achievement.challenge_type);
            shouldAward = stats && stats.total_minutes >= achievement.requirement_value;
          } else {
            // Logro general de minutos
            const totalMinutes = challengeStats?.reduce((total, cs) => total + cs.total_minutes, 0) || 0;
            shouldAward = totalMinutes >= achievement.requirement_value;
          }
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

    return data?.map(item => item.achievements).filter(Boolean) as unknown as Achievement[] || [];
  }

  // Actualizar estadísticas del reto
  async updateChallengeStats(userId: string, challengeType: ChallengeType, sessionDuration: number = 0): Promise<void> {
    const { error } = await supabase.rpc('update_challenge_stats', {
      p_user_id: userId,
      p_challenge_type: challengeType,
      p_session_duration: sessionDuration
    });

    if (error) {
      console.error('Error updating challenge stats:', error);
    }
  }

  // Obtener estadísticas de un reto específico
  async getChallengeStats(userId: string, challengeType: ChallengeType): Promise<ChallengeStats | null> {
    const { data, error } = await supabase
      .from('challenge_stats')
      .select('*')
      .eq('user_id', userId)
      .eq('challenge_type', challengeType)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    return data;
  }

  // Obtener todos los retos del usuario
  async getAllUserChallenges(userId: string): Promise<UserChallenge[]> {
    const { data, error } = await supabase
      .from('user_challenges')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  }

  // Obtener progreso de todos los retos del usuario
  async getAllUserProgress(userId: string): Promise<{
    challenges: UserChallenge[];
    progress: DailyProgress[];
    stats: ChallengeStats[];
  }> {
    const [challenges, progressData, stats] = await Promise.all([
      this.getAllUserChallenges(userId),
      this.getAllUserProgressData(userId),
      this.getAllUserStats(userId)
    ]);

    return { challenges, progress: progressData, stats };
  }

  // Obtener todas las estadísticas del usuario
  async getAllUserStats(userId: string): Promise<ChallengeStats[]> {
    const { data, error } = await supabase
      .from('challenge_stats')
      .select('*')
      .eq('user_id', userId)
      .order('total_sessions', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  }

  // Obtener progreso de todos los retos (corregido)
  async getAllUserProgressData(userId: string): Promise<DailyProgress[]> {
    const { data, error } = await supabase
      .from('daily_progress')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  }
}

export const challengeService = new ChallengeService();

