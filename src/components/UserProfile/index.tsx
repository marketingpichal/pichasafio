import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Edit3, 
  Save, 
  X, 
  Trophy, 
  Heart, 
  Flame, 
  Star, 
  Palette, 
  Camera,
  Zap,
  Target,
  Award,
  Crown,
  Sparkles,
  Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import CreatePost from '../CreatePost';
import PostFeed from '../PostFeed';

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
  { id: 'neon', name: 'Neon Vibes', colors: 'from-pink-500 via-purple-500 to-cyan-500' },
  { id: 'sunset', name: 'Sunset Glow', colors: 'from-orange-400 via-red-500 to-pink-500' },
  { id: 'ocean', name: 'Ocean Wave', colors: 'from-blue-400 via-teal-500 to-green-400' },
  { id: 'galaxy', name: 'Galaxy Dream', colors: 'from-purple-600 via-blue-600 to-indigo-800' },
  { id: 'fire', name: 'Fire Storm', colors: 'from-red-500 via-orange-500 to-yellow-400' }
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
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [postRefreshTrigger, setPostRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<'stats' | 'posts'>('stats');
  const [profile, setProfile] = useState<UserProfile>({
    id: user?.id || '1',
    nickname: user?.user_metadata?.nickname || 'Player_' + Math.floor(Math.random() * 1000),
    bio: '¡Hola! Soy nuevo en Pichasafio 🔥',
    avatar: '🦄',
    theme: 'neon',
    stats: {
      level: 5,
      experience: 750,
      maxExperience: 1000,
      totalLikes: 234,
      streak: 12,
      posesCompleted: 28,
      achievements: ['first_pose', 'week_streak']
    }
  });
  const [editForm, setEditForm] = useState({ nickname: '', bio: '' });

  useEffect(() => {
    if (isEditing) {
      setEditForm({ nickname: profile.nickname, bio: profile.bio });
    }
  }, [isEditing, profile]);

  const handleSave = () => {
    setProfile(prev => ({
      ...prev,
      nickname: editForm.nickname,
      bio: editForm.bio
    }));
    setIsEditing(false);
  };

  const handleThemeChange = (themeId: string) => {
    setProfile(prev => ({ ...prev, theme: themeId }));
    setShowThemeSelector(false);
  };

  const handleAvatarChange = (avatar: string) => {
    setProfile(prev => ({ ...prev, avatar }));
    setShowAvatarSelector(false);
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
            className={`text-4xl font-bold bg-gradient-to-r ${currentTheme.colors} bg-clip-text text-transparent mb-2`}
            animate={{ 
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Mi Perfil
          </motion.h1>
          <p className="text-gray-400">Personaliza tu experiencia en Pichasafio</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div 
          variants={itemVariants}
          className={`bg-gradient-to-br ${currentTheme.colors} p-1 rounded-3xl`}
        >
          <div className="bg-gray-900 rounded-3xl p-8">
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
                  className="absolute -bottom-2 -right-2 bg-gray-700 hover:bg-gray-600 rounded-full p-2 transition-colors"
                >
                  <Camera className="w-4 h-4" />
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
                      className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white w-full focus:border-pink-500 focus:outline-none"
                      placeholder="Tu nickname"
                    />
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 text-white w-full h-20 resize-none focus:border-pink-500 focus:outline-none"
                      placeholder="Cuéntanos sobre ti..."
                    />
                    <div className="flex gap-2 justify-center md:justify-start">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
                      >
                        <Save className="w-4 h-4" />
                        Guardar
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        Cancelar
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-3 justify-center md:justify-start mb-2">
                      <h2 className="text-2xl font-bold">{profile.nickname}</h2>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsEditing(true)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit3 className="w-5 h-5" />
                      </motion.button>
                    </div>
                    <p className="text-gray-300 mb-4">{profile.bio}</p>
                    
                    {/* Level Progress */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Nivel {profile.stats.level}</span>
                        <span className="text-sm text-gray-400">{profile.stats.experience}/{profile.stats.maxExperience} XP</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-3">
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
                      className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-xl flex items-center gap-2 transition-colors mx-auto md:mx-0"
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
          <div className="flex bg-gray-800 rounded-xl p-1 border border-gray-700">
            <button
              onClick={() => setActiveTab('stats')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'stats'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Estadísticas
            </button>
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'posts'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Mis Posts
            </button>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreatePost(true)}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl font-medium flex items-center gap-2 hover:shadow-lg hover:shadow-pink-500/25 transition-all"
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
                className="bg-gray-800 rounded-2xl p-6 text-center border border-gray-700 hover:border-pink-500 transition-all"
              >
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-3xl mb-2"
                >
                  ❤️
                </motion.div>
                <div className="text-2xl font-bold text-pink-400 mb-1">{profile.stats.totalLikes}</div>
                <div className="text-gray-400 text-sm">Likes Totales</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gray-800 rounded-2xl p-6 text-center border border-gray-700 hover:border-orange-500 transition-all"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-3xl mb-2"
                >
                  🔥
                </motion.div>
                <div className="text-2xl font-bold text-orange-400 mb-1">{profile.stats.streak}</div>
                <div className="text-gray-400 text-sm">Días de Racha</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gray-800 rounded-2xl p-6 text-center border border-gray-700 hover:border-purple-500 transition-all"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="text-3xl mb-2"
                >
                  🎯
                </motion.div>
                <div className="text-2xl font-bold text-purple-400 mb-1">{profile.stats.posesCompleted}</div>
                <div className="text-gray-400 text-sm">Poses Completadas</div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-gray-800 rounded-2xl p-6 text-center border border-gray-700 hover:border-yellow-500 transition-all"
              >
                <motion.div
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-3xl mb-2"
                >
                  👑
                </motion.div>
                <div className="text-2xl font-bold text-yellow-400 mb-1">{profile.stats.level}</div>
                <div className="text-gray-400 text-sm">Nivel Actual</div>
              </motion.div>
            </motion.div>

            {/* Achievements */}
            <motion.div variants={itemVariants} className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Logros Desbloqueados
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {achievements.map((achievement) => {
                  const isUnlocked = profile.stats.achievements.includes(achievement.id);
                  return (
                    <motion.div
                      key={achievement.id}
                      whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
                      className={`p-4 rounded-xl text-center transition-all ${
                        isUnlocked 
                          ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/50' 
                          : 'bg-gray-700 border border-gray-600 opacity-50'
                      }`}
                    >
                      <div className={`text-2xl mb-2 ${isUnlocked ? '' : 'grayscale'}`}>
                        {achievement.icon}
                      </div>
                      <div className={`text-sm font-semibold mb-1 ${isUnlocked ? 'text-yellow-400' : 'text-gray-500'}`}>
                        {achievement.name}
                      </div>
                      <div className={`text-xs ${isUnlocked ? 'text-gray-300' : 'text-gray-600'}`}>
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
              <h3 className="text-xl font-bold text-white mb-4 text-center">Elige tu Tema 🎨</h3>
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
              <h3 className="text-xl font-bold text-white mb-4 text-center">Elige tu Avatar 🎭</h3>
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