import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Lock, Calendar, Clock, BookOpen, Heart, Dumbbell } from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';
import { dailyLoginService, DailyVideo } from '../../lib/dailyLoginService';
import ResponsiveCard from '../common/ResponsiveCard';

interface VideoPlayerProps {
  video: DailyVideo;
  onClose: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.8 }}
        className="bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-white font-poppins-bold">
            Día {video.day}: {video.title}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>
        
        <div className="aspect-video mb-4">
          <iframe
            src={video.embedUrl}
            title={video.title}
            className="w-full h-full rounded-lg"
            allowFullScreen
          />
        </div>
        
        <div className="space-y-3">
          <p className="text-gray-300 font-poppins-light">{video.description}</p>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{video.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>Día {video.day}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const DailyVideos: React.FC = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState<DailyVideo[]>([]);
  const [currentUserDay, setCurrentUserDay] = useState<number>(0);
  const [selectedVideo, setSelectedVideo] = useState<DailyVideo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserVideos();
      recordDailyLogin();
    }
  }, [user]);

  const recordDailyLogin = async () => {
    if (!user) return;
    
    try {
      await dailyLoginService.recordDailyLogin(user.id);
    } catch (error) {
      console.error('Error recording daily login:', error);
    }
  };

  const loadUserVideos = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const [availableVideos, userDay] = await Promise.all([
        dailyLoginService.getAvailableVideos(user.id),
        dailyLoginService.getCurrentUserDay(user.id)
      ]);
      
      setVideos(availableVideos);
      setCurrentUserDay(userDay);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'rutina':
        return <Dumbbell className="w-5 h-5" />;
      case 'motivacion':
        return <Heart className="w-5 h-5" />;
      case 'educativo':
        return <BookOpen className="w-5 h-5" />;
      default:
        return <Play className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'rutina':
        return 'from-blue-500 to-purple-600';
      case 'motivacion':
        return 'from-pink-500 to-red-600';
      case 'educativo':
        return 'from-green-500 to-blue-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (!user) {
    return (
      <ResponsiveCard className="text-center">
        <div className="py-8">
          <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2 font-poppins-bold">
            Inicia Sesión para Ver Videos
          </h3>
          <p className="text-gray-300 font-poppins-light">
            Accede a videos exclusivos basados en tus días de inicio de sesión
          </p>
        </div>
      </ResponsiveCard>
    );
  }

  if (loading) {
    return (
      <ResponsiveCard className="text-center">
        <div className="py-8">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-300 font-poppins-light">Cargando videos...</p>
        </div>
      </ResponsiveCard>
    );
  }

  return (
    <>
      <ResponsiveCard
        title="Videos Diarios"
        subtitle={`Has iniciado sesión ${currentUserDay} ${currentUserDay === 1 ? 'día' : 'días'}. ¡Desbloquea más videos iniciando sesión diariamente!`}
        className="mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <motion.div
              key={video.day}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: video.day * 0.1 }}
              className={`relative bg-gray-800 rounded-lg overflow-hidden ${
                video.unlocked ? 'cursor-pointer hover:bg-gray-700' : 'opacity-60'
              } transition-all duration-200`}
              onClick={() => video.unlocked && setSelectedVideo(video)}
            >
              <div className="aspect-video bg-gray-700 flex items-center justify-center relative">
                {video.unlocked ? (
                  <>
                    <div className={`absolute inset-0 bg-gradient-to-br ${getCategoryColor(video.category)} opacity-20`}></div>
                    <Play className="w-12 h-12 text-white z-10" />
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-gray-600 opacity-50"></div>
                    <Lock className="w-12 h-12 text-gray-400 z-10" />
                  </>
                )}
                
                {/* Day Badge */}
                <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm font-bold">
                  Día {video.day}
                </div>
                
                {/* Category Badge */}
                <div className={`absolute top-2 right-2 bg-gradient-to-r ${getCategoryColor(video.category)} text-white p-1.5 rounded`}>
                  {getCategoryIcon(video.category)}
                </div>
              </div>
              
              <div className="p-4">
                <h4 className="font-semibold text-white mb-1 font-poppins-semibold text-sm">
                  {video.title}
                </h4>
                <p className="text-gray-400 text-xs mb-2 font-poppins-light line-clamp-2">
                  {video.description}
                </p>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{video.duration}</span>
                  </div>
                  <span className="capitalize">{video.category}</span>
                </div>
                
                {!video.unlocked && video.day > 1 && (
                  <div className="mt-2 text-xs text-yellow-400 font-poppins-light">
                    Inicia sesión {video.day - currentUserDay} días más para desbloquear
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 text-center">
          <div className="bg-blue-900 bg-opacity-50 border border-blue-500 rounded-lg p-4">
            <h4 className="text-blue-300 font-semibold mb-2 font-poppins-semibold">
              {currentUserDay === 0 ? '¡Bienvenido!' : `¡Día ${currentUserDay}!`}
            </h4>
            <p className="text-blue-200 text-sm font-poppins-light">
              {currentUserDay === 0 
                ? 'Inicia sesión diariamente para desbloquear nuevos videos de entrenamiento. ¡Tu primer video ya está disponible!'
                : 'Continúa iniciando sesión diariamente para desbloquear más videos de entrenamiento.'
              }
            </p>
          </div>
        </div>
      </ResponsiveCard>
      
      {selectedVideo && (
        <VideoPlayer
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </>
  );
};

export default DailyVideos;