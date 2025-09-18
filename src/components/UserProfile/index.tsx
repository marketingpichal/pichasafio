import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit3, 
  Save, 
  X, 
  Trophy, 
  Palette, 
  Camera,
  Plus,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';
import CreatePost from '../CreatePost';
import PostFeed from '../PostFeed';
import { profileService, type UserProfile as ProfileData, type UserStats as UserStatsData, type ProfileUpdateData } from '../../lib/profileService';

interface UserStats {
  level: number;
  experience: number;
  maxExperience: number;
  totalLikes: number;
  streak: number;
  posesCompleted: number;
  achievements: string[];
}

interface UserProfile {
  id: string;
  nickname: string;
  bio: string;
  avatar: string;
  theme: string;
  stats: UserStats;
}

const themes = [
  { id: 'default', name: 'Clásico', colors: 'from-blue-500 via-purple-500 to-cyan-500' },
  { id: 'neon', name: 'Neón', colors: 'from-pink-500 via-purple-500 to-cyan-500' },
  { id: 'sunset', name: 'Atardecer', colors: 'from-orange-400 via-red-500 to-pink-500' },
  { id: 'ocean', name: 'Océano', colors: 'from-blue-400 via-teal-500 to-green-400' },
  { id: 'galaxy', name: 'Galaxia', colors: 'from-purple-600 via-blue-600 to-indigo-800' },
  { id: 'fire', name: 'Fuego', colors: 'from-red-500 via-orange-500 to-yellow-400' }
];

const avatars = [
  '🦄', '🔥', '⚡', '🌟', '💎', '🚀', '🎯', '👑', '🎮', '🌈',
  '🦋', '🌸', '🍭', '🎨', '🎪', '🎭', '🎵', '🎸', '🎤', '🎬'
];

const achievements = [
  { id: 'first_pose', name: 'Primera Pose', icon: '🎯', description: 'Completaste tu primera pose' },
  { id: 'week_streak', name: 'Racha Semanal', icon: '🔥', description: '7 días consecutivos' },
  { id: 'hundred_likes', name: 'Popular', icon: '❤️', description: '100 likes recibidos' },
  { id: 'level_10', name: 'Experto', icon: '👑', description: 'Alcanzaste nivel 10' },
  { id: 'explorer', name: 'Explorador', icon: '🗺️', description: '50 poses diferentes' }
];

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postRefreshTrigger, setPostRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<'stats' | 'posts'>('stats');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado para datos reales del perfil
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [userStats, setUserStats] = useState<UserStatsData | null>(null);
  
  // Estado para datos de la UI (combinación de datos reales y UI)
  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || '1',
    nickname: user?.user_metadata?.username || 'Usuario',
    bio: '¡Hola! Soy nuevo en Pichasafio',
    avatar: '🌟',
    theme: 'default',
    stats: {
      level: 1,
      experience: 0,
      maxExperience: 100,
      totalLikes: 0,
      streak: 0,
      posesCompleted: 0,
      achievements: []
    }
  });
  const [editForm, setEditForm] = useState({ nickname: '' });

  // Cargar datos del perfil
  useEffect(() => {
    const loadProfileData = async () => {
      if (!user?.id) return;

      try {
        setIsLoading(true);
        setError(null);

        // Cargar perfil del usuario
        const profileData = await profileService.getUserProfile(user.id);
        if (profileData) {
          setProfileData(profileData);
          
          // Actualizar estado de la UI
          setProfile(prev => ({
            ...prev,
            id: profileData.id,
            nickname: profileData.username || 'Usuario',
            bio: profileData.bio || '🌟 ¡Hola! Soy nuevo en el universo Pichasafio 🚀',
            avatar: profileData.avatar || profileData.avatar_url || '🌟',
            theme: profileData.theme || 'cosmic'
          }));
        }

        // Cargar estadísticas del usuario
        const stats = await profileService.getUserStats(user.id);
        setUserStats(stats);
        
        // Cargar logros del usuario
        const userAchievements = await profileService.getUserAchievements(user.id);
        
        // Actualizar estadísticas en la UI
        setProfile(prev => ({
          ...prev,
          stats: {
            level: stats.level,
            experience: stats.total_points % 100,
            maxExperience: 100,
            totalLikes: stats.total_points,
            streak: stats.current_streak,
            posesCompleted: stats.total_sessions,
            achievements: userAchievements.map(achievement => achievement.id)
          }
        }));

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el perfil');
        console.error('Error loading profile:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [user?.id]);

  useEffect(() => {
    if (isEditing) {
      setEditForm({ nickname: profile.nickname });
    }
  }, [isEditing, profile]);

  const handleSave = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      
      const updateData: ProfileUpdateData = {
        username: editForm.nickname
      };

      const updatedProfile = await profileService.updateUserProfile(user.id, updateData);
      
      if (updatedProfile) {
        setProfileData(updatedProfile);
        setProfile(prev => ({
          ...prev,
          nickname: updatedProfile.username || 'Usuario'
        }));
        setIsEditing(false);
        setError(null); // Limpiar errores previos
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al guardar el perfil';
      setError(errorMessage);
      console.error('Error saving profile:', err);
      
      // Si el error es por campos que no existen, mostrar mensaje informativo
      if (errorMessage.includes('Could not find the')) {
        setError('Solo se puede editar el nombre de usuario por ahora.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleThemeChange = async (themeId: string) => {
    // Por ahora solo actualizar el estado local ya que el campo theme no existe en la BD
    setProfile(prev => ({ ...prev, theme: themeId }));
    setShowThemeSelector(false);
    
    // Mostrar mensaje informativo
    setError('La personalización de tema se guardará localmente por ahora.');
    setTimeout(() => setError(null), 3000);
  };

  const handleAvatarChange = async (avatar: string) => {
    // Por ahora solo actualizar el estado local ya que el campo avatar no existe en la BD
    setProfile(prev => ({ ...prev, avatar }));
    setShowAvatarSelector(false);
    
    // Mostrar mensaje informativo
    setError('La personalización de avatar se guardará localmente por ahora.');
    setTimeout(() => setError(null), 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const currentTheme = themes.find(t => t.id === profile.theme) || themes[0];
  const progressPercentage = (profile.stats.experience / profile.stats.maxExperience) * 100;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium">Cargando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <p className="text-red-400 font-medium mb-2">Error al cargar el perfil</p>
          <p className="text-gray-400 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto space-y-6"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.h1 
            className={`text-5xl font-bold bg-gradient-to-r ${currentTheme.colors} bg-clip-text text-transparent mb-2`}
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Mi Perfil
          </motion.h1>
          <p className="text-blue-400 text-lg">Personaliza tu experiencia en Pichasafio</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div 
          variants={itemVariants}
          className={`bg-gradient-to-br ${currentTheme.colors} p-1 rounded-3xl`}
        >
          <div className="bg-gray-800/90 backdrop-blur-sm rounded-3xl p-8 border border-gray-600/30">
            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Avatar */}
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className={`w-24 h-24 bg-gradient-to-br ${currentTheme.colors} rounded-full flex items-center justify-center text-4xl cursor-pointer`}
                  onClick={() => setShowAvatarSelector(true)}
                  whileHover={{ rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {profile.avatar}
                </motion.div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAvatarSelector(true)}
                  className="absolute -bottom-2 -right-2 bg-blue-600/80 hover:bg-blue-600 rounded-full p-2 transition-colors border border-blue-400/50"
                >
                  <Camera className="w-4 h-4 text-blue-400" />
                </motion.button>
              </motion.div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={editForm.nickname}
                      onChange={(e) => setEditForm(prev => ({ ...prev, nickname: e.target.value }))}
                      className="bg-gray-800/80 border border-gray-600/50 rounded-xl px-4 py-2 text-white w-full focus:border-blue-400 focus:outline-none placeholder-gray-400"
                      placeholder="Tu nickname"
                    />
                    <div className="text-sm text-blue-400/80 text-center md:text-left">
                      <p>Solo puedes editar tu nombre de usuario por ahora</p>
                    </div>
                    <div className="flex gap-2 justify-center md:justify-start">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        className="bg-gradient-to-r from-blue-600 to-blue-400 px-4 py-2 rounded-xl flex items-center gap-2 transition-all text-white border border-blue-400/30"
                      >
                        <Save className="w-4 h-4" />
                        Guardar
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-800/80 hover:bg-gray-700/50 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors text-gray-300 border border-gray-600/50"
                      >
                        <X className="w-4 h-4" />
                        Cancelar
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                      <h2 className="text-2xl font-bold text-blue-400">{profile.nickname}</h2>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsEditing(true)}
                        className="text-blue-600 hover:text-blue-400 transition-colors"
                      >
                        <Edit3 className="w-5 h-5" />
                      </motion.button>
                    </div>
                    <p className="text-blue-400/90 mb-4">{profile.bio}</p>
                    
                    {/* Información adicional del perfil */}
                    {profileData && (
                      <div className="mb-4 text-sm text-blue-400/70">
                        <p>Miembro desde: {new Date(profileData.created_at).toLocaleDateString()}</p>
                        {profileData.updated_at && (
                          <p>Última actualización: {new Date(profileData.updated_at).toLocaleDateString()}</p>
                        )}
                      </div>
                    )}
                    
                    {/* Level Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-blue-400">Nivel {profile.stats.level}</span>
                        <span className="text-sm text-purple-400">{profile.stats.experience}/{profile.stats.maxExperience} XP</span>
                      </div>
                      <div className="w-full bg-gray-800/60 rounded-full h-3 border border-gray-600/30">
                        <motion.div
                          className={`h-3 bg-gradient-to-r ${currentTheme.colors} rounded-full`}
                          initial={{ width: 0 }}
                          animate={{ width: `${progressPercentage}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                      </div>
                    </div>
                    
                    {/* Theme Selector */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowThemeSelector(true)}
                      className="bg-gradient-to-r from-blue-600/80 to-blue-500/80 px-4 py-2 rounded-xl flex items-center gap-2 transition-all mx-auto md:mx-0 border border-blue-400/30 text-blue-400"
                    >
                      <Palette className="w-4 h-4" />
                      Cambiar Tema
                    </motion.button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tabs and Create Post Button */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-6">
          <div className="flex bg-gray-800/80 rounded-xl p-1 border border-gray-600/50 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeTab === 'stats'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white'
                  : 'text-blue-400/70 hover:text-blue-400 hover:bg-blue-600/20'
              }`}
            >
              Estadísticas
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-6 py-2 rounded-lg transition-all ${
                activeTab === 'posts'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white'
                  : 'text-blue-400/70 hover:text-blue-400 hover:bg-blue-600/20'
              }`}
            >
              Mis Posts
            </button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreatePost(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all border border-blue-400/30"
          >
            <Plus className="w-5 h-5" />
            Crear Post
          </motion.button>
        </motion.div>

        {/* Stats Grid */}
        {activeTab === 'stats' && (
          <>
            <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gray-800/80 rounded-2xl p-6 text-center border border-gray-600/50 hover:border-blue-400 transition-all backdrop-blur-sm"
              >
                <div className="text-3xl mb-2">💖</div>
                <div className="text-2xl font-bold text-blue-400 mb-1">{profile.stats.totalLikes}</div>
                <div className="text-purple-400/80 text-sm">Likes</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gray-800/80 rounded-2xl p-6 text-center border border-gray-600/50 hover:border-blue-400 transition-all backdrop-blur-sm"
              >
                <div className="text-3xl mb-2">🔥</div>
                <div className="text-2xl font-bold text-blue-400 mb-1">{profile.stats.streak}</div>
                <div className="text-purple-400/80 text-sm">Racha</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gray-800/80 rounded-2xl p-6 text-center border border-gray-600/50 hover:border-blue-400 transition-all backdrop-blur-sm"
              >
                <div className="text-3xl mb-2">🎯</div>
                <div className="text-2xl font-bold text-blue-400 mb-1">{profile.stats.posesCompleted}</div>
                <div className="text-purple-400/80 text-sm">Poses Completadas</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gray-800/80 rounded-2xl p-6 text-center border border-gray-600/50 hover:border-blue-400 transition-all backdrop-blur-sm"
              >
                <div className="text-3xl mb-2">⭐</div>
                <div className="text-2xl font-bold text-blue-400 mb-1">{profile.stats.level}</div>
                <div className="text-purple-400/80 text-sm">Nivel</div>
              </motion.div>
            </motion.div>

            {/* Achievements */}
            <motion.div variants={itemVariants} className="bg-gray-800/80 rounded-2xl p-6 border border-gray-600/50 backdrop-blur-sm">
              <h3 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-blue-400" />
                Logros Desbloqueados
              </h3>
              
              {/* Información adicional de estadísticas */}
              {userStats && (
                <div className="mb-6 p-4 bg-blue-600/20 rounded-xl border border-blue-400/30">
                  <h4 className="text-lg font-bold text-blue-400 mb-3">Estadísticas Detalladas</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-purple-400/80">Puntos Totales</p>
                      <p className="text-blue-400 font-bold">{userStats.total_points}</p>
                    </div>
                    <div>
                      <p className="text-purple-400/80">Racha Más Larga</p>
                      <p className="text-blue-400 font-bold">{userStats.longest_streak} días</p>
                    </div>
                    <div>
                      <p className="text-purple-400/80">Minutos Totales</p>
                      <p className="text-blue-400 font-bold">{userStats.total_minutes}</p>
                    </div>
                    <div>
                      <p className="text-purple-400/80">Retos Completados</p>
                      <p className="text-blue-400 font-bold">{userStats.challenges_completed}</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {achievements.map((achievement) => {
                  const isUnlocked = profile.stats.achievements.includes(achievement.id);
                  return (
                    <motion.div
                      key={achievement.id}
                      whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
                      className={`p-4 rounded-xl text-center transition-all ${
                        isUnlocked 
                          ? 'bg-gradient-to-br from-blue-600/30 to-blue-400/30 border border-blue-400/50' 
                          : 'bg-gray-800/50 border border-gray-600/30 opacity-50'
                      }`}
                    >
                      <div className={`text-2xl mb-2 ${isUnlocked ? '' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <div className={`text-sm font-bold mb-1 ${isUnlocked ? 'text-blue-400' : 'text-purple-400/50'}`}>
                        {achievement.name}
                      </div>
                      <div className={`text-xs ${isUnlocked ? 'text-purple-400/80' : 'text-purple-400/40'}`}>
                        {achievement.description}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <motion.div variants={itemVariants}>
            <PostFeed userId={profile.id} refreshTrigger={postRefreshTrigger} />
          </motion.div>
        )}
      </motion.div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreatePost(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-full max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <CreatePost 
                isOpen={showCreatePost} 
                onClose={() => setShowCreatePost(false)}
                onPostCreated={() => {
                  // Actualizar el feed sin recargar la página
                  setPostRefreshTrigger(prev => prev + 1);
                  setShowCreatePost(false);
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme Selector Modal */}
      <AnimatePresence>
        {showThemeSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowThemeSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-800 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4 text-center">Elige tu Tema</h3>
              <div className="grid grid-cols-1 gap-3">
                {themes.map((theme) => (
                  <motion.button
                    key={theme.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleThemeChange(theme.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      profile.theme === theme.id 
                        ? 'border-white' 
                        : 'border-transparent hover:border-gray-600'
                    }`}
                  >
                    <div className={`w-full h-12 bg-gradient-to-r ${theme.colors} rounded-lg mb-2`} />
                    <div className="text-white font-semibold">{theme.name}</div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar Selector Modal */}
      <AnimatePresence>
        {showAvatarSelector && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAvatarSelector(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-800 rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4 text-center">Elige tu Avatar</h3>
              <div className="grid grid-cols-5 gap-3">
                {avatars.map((avatar) => (
                  <motion.button
                    key={avatar}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleAvatarChange(avatar)}
                    className={`w-12 h-12 rounded-xl text-2xl flex items-center justify-center transition-all ${
                      profile.avatar === avatar 
                        ? 'bg-gradient-to-br from-pink-500 to-purple-500' 
                        : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    {avatar}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;