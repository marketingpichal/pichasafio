import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, Star, Zap, Flame, X } from "lucide-react";

interface Notification {
  id: string;
  type: 'achievement' | 'streak' | 'level' | 'challenge';
  title: string;
  message: string;
  icon: string;
  points?: number;
  timestamp: Date;
}

const AchievementNotification: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hasShownNotifications, setHasShownNotifications] = useState(false);

  useEffect(() => {
    // Solo mostrar notificaciones una vez
    if (hasShownNotifications) return;

    // Simular notificaciones en tiempo real
    const mockNotifications: Notification[] = [
      {
        id: '1',
        type: 'achievement',
        title: '¡Logro Desbloqueado!',
        message: 'Has ganado el logro "Primer Día"',
        icon: '🎯',
        points: 10,
        timestamp: new Date()
      },
      {
        id: '2',
        type: 'streak',
        title: '¡Racha Increíble!',
        message: 'Has mantenido una racha de 7 días',
        icon: '🔥',
        points: 50,
        timestamp: new Date()
      },
      {
        id: '3',
        type: 'level',
        title: '¡Subiste de Nivel!',
        message: 'Has alcanzado el nivel 5',
        icon: '⭐',
        points: 25,
        timestamp: new Date()
      }
    ];

    const timeouts: NodeJS.Timeout[] = [];

    // Mostrar notificaciones con delay y auto-remover
    mockNotifications.forEach((notification, index) => {
      const showTimeout = setTimeout(() => {
        setNotifications(prev => {
          // Evitar duplicados
          if (prev.some(n => n.id === notification.id)) {
            return prev;
          }
          return [notification, ...prev.slice(0, 2)];
        });
        
        // Auto-remover la notificación después de 5 segundos
        const removeTimeout = setTimeout(() => {
          setNotifications(prev => prev.filter(n => n.id !== notification.id));
        }, 5000);
        
        timeouts.push(removeTimeout);
      }, index * 3000);
      
      timeouts.push(showTimeout);
    });

    setHasShownNotifications(true);

    // Cleanup function para limpiar timeouts si el componente se desmonta
    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
      setNotifications([]);
    };
  }, [hasShownNotifications]);

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Función para mostrar notificaciones reales (puede ser llamada desde otros componentes)
  const showNotification = (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date()
    };

    setNotifications(prev => [newNotification, ...prev.slice(0, 2)]);

    // Auto-remover después de 5 segundos
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };

  // Exponer la función globalmente para que otros componentes puedan usarla
  React.useEffect(() => {
    (window as any).showAchievementNotification = showNotification;
    
    return () => {
      delete (window as any).showAchievementNotification;
    };
  }, []);

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'achievement':
        return 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
      case 'streak':
        return 'bg-gradient-to-r from-red-500/20 to-pink-500/20 border-red-500/30';
      case 'level':
        return 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30';
      case 'challenge':
        return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30';
      default:
        return 'bg-gradient-to-r from-gray-500/20 to-gray-600/20 border-gray-500/30';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
            className={`relative ${getNotificationStyle(notification.type)} border rounded-xl p-4 shadow-lg backdrop-blur-sm min-w-[320px]`}
          >
            {/* Close button */}
            <button
              onClick={() => removeNotification(notification.id)}
              className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Notification content */}
            <div className="flex items-start space-x-3">
              <div className="text-2xl">{notification.icon}</div>
              <div className="flex-1">
                <h4 className="font-semibold text-white text-sm mb-1">
                  {notification.title}
                </h4>
                <p className="text-gray-300 text-xs mb-2">
                  {notification.message}
                </p>
                {notification.points && (
                  <div className="flex items-center space-x-1">
                    <Zap className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-400 text-xs font-semibold">
                      +{notification.points} XP
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Progress bar */}
            <div className="mt-3 h-1 bg-gray-700/50 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 5, ease: "linear" }}
              />
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default AchievementNotification;
