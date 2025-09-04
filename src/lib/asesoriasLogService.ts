import { supabase } from './supabaseClient';

export interface AsesoriaLogData {
  nombre: string;
  telefono: string;
  motivo: string;
  descripcion: string;
  whatsappUrl: string;
  whatsappNumber: string;
}

export interface AsesoriaLogEntry extends AsesoriaLogData {
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
  sessionId?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
}

export interface AsesoriaLogStats {
  totalSubmissions: number;
  submissionsToday: number;
  submissionsThisWeek: number;
  submissionsThisMonth: number;
  topMotivos: Array<{ motivo: string; count: number }>;
  conversionRate?: number;
}

class AsesoriasLogService {
  /**
   * Registra una nueva solicitud de asesoría en la base de datos
   * Usa HTTP directo para evitar problemas de cache de PostgREST
   */
  async logAsesoriaSubmission(data: AsesoriaLogData): Promise<boolean> {
    try {
      // Obtener información adicional del navegador
      const additionalData = this.getAdditionalTrackingData();
      
      // Preparar datos para inserción
      const insertData = {
        name: data.nombre,
        phone: data.telefono,
        reason: data.motivo,
        description: data.descripcion,
        whatsapp_url: data.whatsappUrl,
        whatsapp_number: data.whatsappNumber,
        user_agent: additionalData.userAgent || null,
        referrer: additionalData.referrer || null,
        session_id: additionalData.sessionId || null,
        utm_source: additionalData.utmSource || null,
        utm_medium: additionalData.utmMedium || null,
        utm_campaign: additionalData.utmCampaign || null,
        utm_term: additionalData.utmTerm || null,
        utm_content: additionalData.utmContent || null,
      };

      console.log('📊 Attempting to log asesoría submission:', insertData);

      // Usar el cliente de Supabase directamente
      const { data: result, error } = await supabase
        .from('asesorias_logs')
        .insert(insertData)
        .select();

      if (error) {
        console.error('❌ Supabase insert failed:', error);
        return false;
      }

      console.log('✅ Asesoría submission logged successfully via Supabase SDK:', result);
      return true;
    } catch (error) {
      console.error('❌ Error in logAsesoriaSubmission:', error);
      return false;
    }
  }

  /**
   * Obtiene estadísticas de las solicitudes de asesorías
   */
  async getAsesoriaStats(): Promise<AsesoriaLogStats | null> {
    try {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Total de submissions
      const { count: totalSubmissions } = await supabase
        .from('asesorias_logs')
        .select('*', { count: 'exact', head: true });

      // Submissions de hoy
      const { count: submissionsToday } = await supabase
        .from('asesorias_logs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString());

      // Submissions de esta semana
      const { count: submissionsThisWeek } = await supabase
        .from('asesorias_logs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', weekAgo.toISOString());

      // Submissions de este mes
      const { count: submissionsThisMonth } = await supabase
        .from('asesorias_logs')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', monthAgo.toISOString());

      // Top motivos
      const { data: motivosData } = await supabase
        .from('asesorias_logs')
        .select('motivo')
        .gte('created_at', monthAgo.toISOString());

      const motivosCount = motivosData?.reduce((acc, item) => {
        acc[item.motivo] = (acc[item.motivo] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      const topMotivos = Object.entries(motivosCount)
        .map(([motivo, count]) => ({ motivo, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return {
        totalSubmissions: totalSubmissions || 0,
        submissionsToday: submissionsToday || 0,
        submissionsThisWeek: submissionsThisWeek || 0,
        submissionsThisMonth: submissionsThisMonth || 0,
        topMotivos,
      };
    } catch (error) {
      console.error('Error getting asesoría stats:', error);
      return null;
    }
  }

  /**
   * Actualiza el estado de un lead
   */
  async updateLeadStatus(telefono: string, status: 'submitted' | 'contacted' | 'converted' | 'lost'): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('asesorias_logs')
        .update({ status })
        .eq('telefono', telefono)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) {
        console.error('Error updating lead status:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in updateLeadStatus:', error);
      return false;
    }
  }

  /**
   * Obtiene información adicional para tracking
   */
  private getAdditionalTrackingData() {
    const urlParams = new URLSearchParams(window.location.search);
    
    return {
      userAgent: navigator.userAgent,
      referrer: document.referrer || undefined,
      sessionId: this.getOrCreateSessionId(),
      utmSource: urlParams.get('utm_source') || undefined,
      utmMedium: urlParams.get('utm_medium') || undefined,
      utmCampaign: urlParams.get('utm_campaign') || undefined,
      utmTerm: urlParams.get('utm_term') || undefined,
      utmContent: urlParams.get('utm_content') || undefined,
    };
  }

  /**
   * Obtiene o crea un session ID único para el usuario
   */
  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('asesorias_session_id');
    
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('asesorias_session_id', sessionId);
    }
    
    return sessionId;
  }

  /**
   * Obtiene los leads más recientes (para dashboard administrativo)
   */
  async getRecentLeads(limit: number = 50) {
    try {
      const { data, error } = await supabase
        .from('asesorias_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error getting recent leads:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getRecentLeads:', error);
      return [];
    }
  }

  /**
   * Busca leads por teléfono (para seguimiento)
   */
  async searchLeadsByPhone(telefono: string) {
    try {
      const { data, error } = await supabase
        .from('asesorias_logs')
        .select('*')
        .eq('telefono', telefono)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error searching leads by phone:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in searchLeadsByPhone:', error);
      return [];
    }
  }
}

// Exportar instancia singleton
export const asesoriasLogService = new AsesoriasLogService();
export default asesoriasLogService;
