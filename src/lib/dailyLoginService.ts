import { supabase } from './supabaseClient';

export interface DailyLogin {
  id: string;
  user_id: string;
  login_date: string;
  day_number: number;
  created_at: string;
}

export interface DailyVideo {
  day: number;
  title: string;
  description: string;
  videoUrl: string;
  embedUrl: string;
  duration: string;
  category: 'rutina' | 'motivacion' | 'educativo';
  unlocked: boolean;
}

class DailyLoginService {
  // Registrar inicio de sesión diario
  async recordDailyLogin(userId: string): Promise<DailyLogin | null> {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Verificar si ya se registró hoy
    const { data: existingLogin } = await supabase
      .from('daily_logins')
      .select('*')
      .eq('user_id', userId)
      .eq('login_date', today)
      .single();
    
    if (existingLogin) {
      return existingLogin;
    }
    
    // Obtener el número de día consecutivo
    const { data: userLogins } = await supabase
      .from('daily_logins')
      .select('*')
      .eq('user_id', userId)
      .order('day_number', { ascending: false })
      .limit(1);
    
    const nextDayNumber = userLogins && userLogins.length > 0 ? userLogins[0].day_number + 1 : 1;
    
    // Registrar nuevo inicio de sesión
    const { data: newLogin, error } = await supabase
      .from('daily_logins')
      .insert({
        user_id: userId,
        login_date: today,
        day_number: nextDayNumber
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error recording daily login:', error);
      return null;
    }
    
    return newLogin;
  }
  
  // Obtener días de inicio de sesión del usuario
  async getUserLoginDays(userId: string): Promise<DailyLogin[]> {
    const { data, error } = await supabase
      .from('daily_logins')
      .select('*')
      .eq('user_id', userId)
      .order('day_number', { ascending: true });
    
    if (error) {
      console.error('Error fetching user login days:', error);
      return [];
    }
    
    return data || [];
  }
  
  // Obtener el día actual del usuario (último día de inicio de sesión)
  async getCurrentUserDay(userId: string): Promise<number> {
    const { data } = await supabase
      .from('daily_logins')
      .select('day_number')
      .eq('user_id', userId)
      .order('day_number', { ascending: false })
      .limit(1)
      .single();
    
    return data?.day_number || 0;
  }
  
  // Verificar si el usuario puede acceder a un video específico
  async canAccessVideo(userId: string, dayNumber: number): Promise<boolean> {
    const userDay = await this.getCurrentUserDay(userId);
    return dayNumber <= userDay;
  }
  
  // Obtener videos disponibles para el usuario
  async getAvailableVideos(userId: string): Promise<DailyVideo[]> {
    const userDay = await this.getCurrentUserDay(userId);
    
    // Videos predefinidos (puedes expandir esto o moverlo a la base de datos)
    const allVideos: DailyVideo[] = [
      {
        day: 1,
        title: "Bienvenida y Fundamentos",
        description: "Introducción a las rutinas y conceptos básicos",
        videoUrl: "https://www.youtube.com/watch?v=_uRHmODSNr0",
        embedUrl: "https://www.youtube.com/embed/_uRHmODSNr0",
        duration: "9:10",
        category: "educativo",
        unlocked: true
      },
      {
        day: 2,
        title: "Rutina Básica de Calentamiento",
        description: "Ejercicios de preparación y calentamiento",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: "15:45",
        category: "rutina",
        unlocked: false
      },
      {
        day: 3,
        title: "Motivación y Constancia",
        description: "Consejos para mantener la motivación",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: "8:20",
        category: "motivacion",
        unlocked: false
      },
      {
        day: 4,
        title: "Técnicas Avanzadas",
        description: "Ejercicios de nivel intermedio",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: "20:15",
        category: "rutina",
        unlocked: false
      },
      {
        day: 5,
        title: "Nutrición y Suplementos",
        description: "Alimentación para mejores resultados",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: "12:40",
        category: "educativo",
        unlocked: false
      },
      {
        day: 6,
        title: "Rutina de Resistencia",
        description: "Ejercicios para aumentar la resistencia",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: "18:30",
        category: "rutina",
        unlocked: false
      },
      {
        day: 7,
        title: "Revisión Semanal",
        description: "Evaluación del progreso de la primera semana",
        videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        duration: "14:20",
        category: "motivacion",
        unlocked: false
      }
    ];
    
    // Marcar videos como desbloqueados según el día del usuario
    // El primer día siempre está desbloqueado
    return allVideos.map(video => ({
      ...video,
      unlocked: video.day === 1 || video.day <= userDay
    }));
  }
}

export const dailyLoginService = new DailyLoginService();