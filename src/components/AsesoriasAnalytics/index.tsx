import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ResponsiveCard from "../common/ResponsiveCard";
import { BarChart3, TrendingUp, Users, Phone, Calendar, Target } from "lucide-react";
import { asesoriasLogService, AsesoriaLogStats } from "../../lib/asesoriasLogService";

const AsesoriasAnalytics: React.FC = () => {
  const [stats, setStats] = useState<AsesoriaLogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await asesoriasLogService.getAsesoriaStats();
      setStats(data);
    } catch (err) {
      setError("Error al cargar estadísticas");
      console.error("Error loading stats:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-300 mt-4">Cargando estadísticas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gray-900 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ResponsiveCard className="text-center">
            <div className="text-red-400 mb-4">
              <Target className="w-12 h-12 mx-auto mb-2" />
              <h2 className="text-xl font-bold">Error al cargar datos</h2>
              <p className="text-gray-300 mt-2">{error}</p>
            </div>
            <button
              onClick={loadStats}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
          </ResponsiveCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8 sm:py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text-extended mb-4">
            Analytics de Asesorías
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
            Estadísticas y KPIs de las solicitudes de asesorías para optimizar tus campañas de marketing
          </p>
        </motion.div>

        {/* KPI Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <ResponsiveCard className="text-center">
            <div className="flex justify-center mb-4">
              <Users className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{stats.totalSubmissions}</h3>
            <p className="text-gray-300 text-sm">Total Solicitudes</p>
          </ResponsiveCard>

          <ResponsiveCard className="text-center">
            <div className="flex justify-center mb-4">
              <Calendar className="w-8 h-8 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{stats.submissionsToday}</h3>
            <p className="text-gray-300 text-sm">Hoy</p>
          </ResponsiveCard>

          <ResponsiveCard className="text-center">
            <div className="flex justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{stats.submissionsThisWeek}</h3>
            <p className="text-gray-300 text-sm">Esta Semana</p>
          </ResponsiveCard>

          <ResponsiveCard className="text-center">
            <div className="flex justify-center mb-4">
              <Phone className="w-8 h-8 text-yellow-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">{stats.submissionsThisMonth}</h3>
            <p className="text-gray-300 text-sm">Este Mes</p>
          </ResponsiveCard>
        </motion.div>

        {/* Top Motivos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-12"
        >
          <ResponsiveCard
            title="Top Motivos de Consulta"
            subtitle="Los problemas más consultados este mes"
          >
            {stats.topMotivos.length > 0 ? (
              <div className="space-y-4">
                {stats.topMotivos.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <span className="text-white font-medium">{item.motivo}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="bg-gray-700 rounded-full h-2 w-32">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full"
                          style={{
                            width: `${(item.count / stats.topMotivos[0].count) * 100}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-gray-300 font-semibold min-w-[2rem]">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No hay datos disponibles aún</p>
              </div>
            )}
          </ResponsiveCard>
        </motion.div>

        {/* Insights y Recomendaciones */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <ResponsiveCard
            title="📊 Insights de Marketing"
            subtitle="Análisis automático de los datos"
          >
            <div className="space-y-4 text-gray-300">
              {stats.submissionsToday > 0 && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Tienes {stats.submissionsToday} nuevas solicitudes hoy</p>
                </div>
              )}
              
              {stats.submissionsThisWeek > stats.submissionsToday && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Promedio de {Math.round(stats.submissionsThisWeek / 7)} solicitudes por día esta semana</p>
                </div>
              )}

              {stats.topMotivos.length > 0 && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>El motivo más consultado es: <strong>{stats.topMotivos[0].motivo}</strong></p>
                </div>
              )}

              {stats.totalSubmissions > 10 && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Ya tienes {stats.totalSubmissions} leads generados - ¡excelente tracción!</p>
                </div>
              )}
            </div>
          </ResponsiveCard>

          <ResponsiveCard
            title="🎯 Recomendaciones"
            subtitle="Cómo optimizar tus campañas"
          >
            <div className="space-y-4 text-gray-300">
              {stats.topMotivos.length > 0 && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p>Crea contenido específico sobre "{stats.topMotivos[0].motivo}" para atraer más leads</p>
                </div>
              )}

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Considera crear landing pages específicas para cada motivo de consulta</p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Implementa UTM parameters en tus campañas para mejor tracking</p>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                <p>Programa seguimientos automáticos para mejorar la conversión</p>
              </div>
            </div>
          </ResponsiveCard>
        </motion.div>

        {/* Refresh Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-8"
        >
          <button
            onClick={loadStats}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 flex items-center justify-center mx-auto space-x-2"
          >
            <TrendingUp className="w-5 h-5" />
            <span>Actualizar Datos</span>
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AsesoriasAnalytics;
