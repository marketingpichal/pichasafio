import { supabase } from './supabaseClient';

export interface UserProfile {
  id: string;
  username: string | null;
  email: string | null;
  bio?: string;
  avatar?: string;
  theme?: string;
  avatar_url?: string;
  created_at: string;
  updated_at?: string;
}

export interface UserStats {
  level: number;
  total_points: number;
  current_streak: number;
  longest_streak: number;
  total_sessions: number;
  total_minutes: number;
  challenges_completed: number;
  achievements: string[];
}

export interface ProfileUpdateData {
  username?: string;
  bio?: string;
  avatar?: string;
  theme?: string;
}

class ProfileService {
  // Obtener perfil del usuario
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data;
  }

  // Actualizar perfil del usuario
  async updateUserProfile(userId: string, updateData: ProfileUpdateData): Promise<UserProfile | null> {
    // Solo actualizar campos que sabemos que existen en la tabla
    const validUpdateData: any = {};

    // Solo incluir username ya que es el único campo que sabemos que existe
    if (updateData.username !== undefined) {
      validUpdateData.username = updateData.username;
    }

    // Solo incluir otros campos si están definidos
    if (updateData.bio !== undefined) {
      validUpdateData.bio = updateData.bio;
    }
    if (updateData.avatar !== undefined) {
      validUpdateData.avatar_url = updateData.avatar;
    }
    if (updateData.theme !== undefined) {
      validUpdateData.theme = updateData.theme;
    }

    const { data, error } = await supabase
      .from('profiles')
      .update(validUpdateData)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating user profile:', error);
      return null;
    }

    return data;
  }

  // Obtener estadísticas del usuario
  async getUserStats(userId: string): Promise<UserStats> {
    // Obtener datos del leaderboard
    const { data: leaderboardEntry } = await supabase
      .from('leaderboard')
      .select('*')
      .eq('user_id', userId)
      .single();

    // Obtener datos de retos completados
    const { data: userChallenges } = await supabase
      .from('user_challenges')
      .select('*')
      .eq('user_id', userId);

    // Calcular estadísticas básicas
    const stats: UserStats = {
      level: leaderboardEntry?.level || 1,
      total_points: leaderboardEntry?.total_points || 0,
      current_streak: leaderboardEntry?.current_streak || 0,
      longest_streak: leaderboardEntry?.longest_streak || 0,
      total_sessions: userChallenges?.length || 0,
      total_minutes: (userChallenges?.length || 0) * 10, // Estimación: 10 minutos por sesión
      challenges_completed: userChallenges?.filter(challenge => !challenge.is_active).length || 0,
      achievements: [] // Por ahora vacío hasta que tengamos la tabla de logros
    };

    return stats;
  }

  // Verificar si un username está disponible
  async isUsernameAvailable(username: string, excludeUserId?: string): Promise<boolean> {
    let query = supabase
      .from('profiles')
      .select('id')
      .eq('username', username);

    if (excludeUserId) {
      query = query.neq('id', excludeUserId);
    }

    const { error } = await query.single();

    if (error && error.code === 'PGRST116') {
      // No se encontró el username, está disponible
      return true;
    }

    if (error) {
      console.error('Error checking username availability:', error);
      return false;
    }

    // Se encontró el username, no está disponible
    return false;
  }

  // Obtener posts del usuario
  async getUserPosts(userId: string, limit: number = 10): Promise<any[]> {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles!posts_user_id_fkey (
          username,
          avatar
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching user posts:', error);
      return [];
    }

    return data || [];
  }

  // Obtener logros disponibles (placeholder por ahora)
  async getAvailableAchievements(): Promise<any[]> {
    // Por ahora retornamos logros hardcodeados hasta que tengamos la tabla
    return [
      { id: 'first_pose', name: 'Primera Pose', description: 'Completaste tu primera pose', icon: '🎯' },
      { id: 'week_streak', name: 'Racha Semanal', description: '7 días consecutivos', icon: '🔥' },
      { id: 'hundred_likes', name: 'Popular', description: '100 likes recibidos', icon: '❤️' },
      { id: 'level_10', name: 'Experto', description: 'Alcanzaste nivel 10', icon: '👑' },
      { id: 'explorer', name: 'Explorador', description: '50 poses diferentes', icon: '🗺️' }
    ];
  }

  // Obtener logros del usuario (placeholder por ahora)
  async getUserAchievements(userId: string): Promise<any[]> {
    // Por ahora retornamos logros básicos basados en el nivel
    const { data: leaderboardEntry } = await supabase
      .from('leaderboard')
      .select('level, total_points')
      .eq('user_id', userId)
      .single();

    const achievements = [];
    
    if (leaderboardEntry) {
      if (leaderboardEntry.level >= 1) {
        achievements.push({ id: 'first_pose', name: 'Primera Pose', description: 'Completaste tu primera pose', icon: '🎯' });
      }
      if (leaderboardEntry.level >= 5) {
        achievements.push({ id: 'week_streak', name: 'Racha Semanal', description: '7 días consecutivos', icon: '🔥' });
      }
      if (leaderboardEntry.total_points >= 100) {
        achievements.push({ id: 'hundred_likes', name: 'Popular', description: '100 likes recibidos', icon: '❤️' });
      }
    }

    return achievements;
  }
}

export const profileService = new ProfileService();
