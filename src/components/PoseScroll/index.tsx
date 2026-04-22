import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye, Star, Lock, ArrowUp, X, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

import { PoseScrollItem } from '../../types/pose';
import { getPoseImages, PoseImage } from '../../lib/cloudinaryService';



// Función para convertir datos de Supabase a PoseScrollItem
const convertToPoseScrollItem = (imageData: PoseImage, index: number): PoseScrollItem => {
  const categories = ['Clásicas', 'Románticas', 'Aventureras', 'Íntimas', 'Experimentales'];
  const difficulties: ('Principiante' | 'Intermedio' | 'Avanzado')[] = ['Principiante', 'Intermedio', 'Avanzado'];

  // Extraer nombre de la pose del name o usar un nombre por defecto
  const poseName = imageData.name.replace(/\.[^/.]+$/, '') || `Pose ${index + 1}`;

  return {
    id: `pose_${index + 1}`,
    name: poseName,
    category: categories[index % categories.length],
    difficulty: difficulties[index % difficulties.length],
    rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
    views: Math.floor(Math.random() * 10000) + 1000,
    likes: Math.floor(Math.random() * 1000) + 100,
    image: imageData.url,
    description: `Descripción detallada de ${poseName}. Una experiencia única que fortalece la conexión íntima.`,
    benefits: ['Mejora la intimidad', 'Fortalece la conexión', 'Aumenta la confianza'],
    isLocked: Math.random() > 0.7 // 30% de poses bloqueadas
  };
};

const PoseScroll: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const isAuthenticated = !!user;
  const [poses, setPoses] = useState<PoseScrollItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedPose, setSelectedPose] = useState<PoseScrollItem | null>(null);





  // Cargar poses iniciales desde Cloudinary
  useEffect(() => {
    const loadInitialPoses = async () => {
      console.log('🔄 Iniciando carga de poses...');
      setLoading(true);

      try {
        console.log('📞 Llamando a getPoseImages...');
        const imageData = await getPoseImages();
        console.log('📊 Datos recibidos de getPoseImages:', imageData.length, imageData);

        const convertedPoses = imageData.map((img: PoseImage, index: number) => convertToPoseScrollItem(img, index));
        console.log('🔄 Poses convertidas:', convertedPoses.length, convertedPoses);

        setPoses(convertedPoses);
        console.log('✅ Poses establecidas en el estado');
      } catch (error) {
        console.error('❌ Error cargando poses:', error);
        // Fallback a poses de ejemplo si hay error
        const fallbackPoses = [
          {
            id: 'fallback-1',
            name: 'Pose Clásica',
            category: 'Clásicas',
            difficulty: 'Principiante' as const,
            rating: 4,
            views: 1500,
            likes: 200,
            image: 'https://picsum.photos/400/600?random=1',
            description: 'Una pose clásica perfecta para principiantes.',
            benefits: ['Intimidad', 'Conexión'],
            isLocked: false
          }
        ];
        setPoses(fallbackPoses);
      } finally {
        setLoading(false);
        console.log('✅ Carga completada, loading = false');
      }
    };

    loadInitialPoses();
  }, []);

  // Detectar scroll para mostrar botón de volver arriba
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cargar más poses desde Cloudinary
  const loadMorePoses = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const allImages = await getPoseImages();
      const startIndex = poses.length;
      const newImages = allImages.slice(startIndex, startIndex + 8);

      if (newImages.length === 0) {
        setHasMore(false);
      } else {
        const newPoses = newImages.map((img: PoseImage, index: number) => convertToPoseScrollItem(img, startIndex + index));
        setPoses(prev => [...prev, ...newPoses]);
      }
    } catch (error) {
      console.error('Error loading more poses:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [poses.length, loading, hasMore]);

  // Detectar scroll infinito
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000) {
        loadMorePoses();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMorePoses]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePoseClick = (pose: PoseScrollItem) => {
    if (pose.isLocked && !isAuthenticated) {
      setSelectedPose(pose);
      setShowAuthModal(true);
    } else {
      // Navegar a la vista detallada de la pose
      navigate(`/pose/${pose.id}`);
    }
  };

  const handleLogin = () => {
    setShowAuthModal(false);
    navigate('/login');
  };

  const handleRegister = () => {
    setShowAuthModal(false);
    navigate('/register');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Principiante':
        return 'bg-green-500';
      case 'Intermedio':
        return 'bg-yellow-500';
      case 'Avanzado':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`}
      />
    ));
  };

  return (
    <div className="bg-transparent py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="challenge-heading text-4xl sm:text-5xl md:text-6xl text-white mb-4 drop-shadow-md uppercase"
          >
            Explorador de Poses
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto font-poppins-light"
          >
            Descubre nuevas formas de conectar con tu pareja. Explora poses con instrucciones detalladas y consejos de expertos.
          </motion.p>

          {/* Botón Reto de 30 días */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <motion.button
              onClick={() => navigate('/thirty-days-challenge')}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-red-600 text-white px-8 py-4 font-poppins-bold uppercase tracking-widest text-lg shadow-lg shadow-red-900/50 hover:bg-red-700 transition-colors flex items-center gap-3 mx-auto"
            >
              <span className="text-2xl">🔥</span>
              Reto de 30 Días
              <span className="text-2xl">💪</span>
            </motion.button>
          </motion.div>
        </div>

        {/* Poses Grid */}
            {/* Poses Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {poses.map((pose, index) => (
                <motion.div
                  key={pose.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden hover:border-red-500/50 transition-all duration-300 group cursor-pointer shadow-lg"
                  onClick={() => handlePoseClick(pose)}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] bg-stone-800 overflow-hidden pointer-events-none">
                    {pose.isLocked && !isAuthenticated ? (
                      <div className="absolute inset-0 bg-stone-900/80 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center">
                          <Lock className="w-8 h-8 text-red-500 mx-auto mb-2" />
                          <p className="text-white text-sm font-poppins-semibold uppercase tracking-wider">Premium</p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <img
                          src={pose.image}
                          alt={pose.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            // Fallback si la imagen no carga
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                                  <div class="text-6xl opacity-50">💕</div>
                                </div>
                              `;
                            }
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-red-600/10 transition-all duration-300" />
                      </>
                    )}

                    {/* Difficulty Badge */}
                    <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold text-white ${getDifficultyColor(pose.difficulty)}`}>
                      {pose.difficulty}
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-2 right-2 bg-stone-900/80 backdrop-blur-sm px-2 py-1 border border-stone-800 rounded-full text-xs text-white">
                      {pose.category}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 pointer-events-none">
                    <h3 className="text-white font-poppins-bold uppercase tracking-wider mb-2 group-hover:text-red-500 transition-colors">
                      {pose.name}
                    </h3>

                    <p className="text-gray-400 text-sm mb-3 font-poppins-light line-clamp-2">
                      {pose.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {renderStars(pose.rating)}
                      <span className="text-gray-400 text-xs ml-1">({pose.rating})</span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{pose.views.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          <span>{pose.likes}</span>
                        </div>
                      </div>

                      {pose.isLocked && !isAuthenticated && (
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Lock className="w-3 h-3" />
                          <span>Premium</span>
                        </div>
                      )}
                    </div>

                    {/* Benefits */}
                    {(!pose.isLocked || isAuthenticated) && (
                      <div className="mt-3 pt-3 border-t border-stone-800">
                        <div className="flex flex-wrap gap-1">
                          {pose.benefits.slice(0, 2).map((benefit, idx) => (
                            <span
                              key={idx}
                              className="bg-stone-800 text-gray-300 px-2 py-1 rounded text-xs font-poppins-medium uppercase"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Loading */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-flex items-center gap-3 text-gray-300">
                  <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                  <span className="font-poppins-light">Cargando más poses...</span>
                </div>
              </div>
            )}

            {/* End Message */}
            {!hasMore && (
              <div className="text-center py-12">
                <div className="text-gray-400 font-poppins-light">
                  ¡Has visto todas las poses disponibles! 🎉
                </div>
              </div>
            )}


        {/* Authentication CTA */}
        {!isAuthenticated && (
          <div className="mt-12 text-center">
            <div className="bg-stone-900 border border-stone-800 p-8 max-w-3xl mx-auto relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
              <h3 className="text-xl font-poppins-bold uppercase tracking-wider text-white mb-4">
                ¿QUIERES ACCESO COMPLETO?
              </h3>
              <p className="text-gray-400 mb-6 font-poppins-medium">
                Regístrate para desbloquear todas las poses premium y contenido exclusivo. Fuego puro.
              </p>
              <button className="bg-red-600 text-white px-8 py-3 font-poppins-bold uppercase tracking-widest text-sm hover:bg-red-700 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-red-900/40">
                Crear Cuenta Gratis
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-red-600 text-white rounded-none flex items-center justify-center shadow-lg shadow-red-900/50 hover:bg-red-700 transform hover:scale-105 transition-all duration-200 z-50"
        >
          <ArrowUp className="w-6 h-6" />
        </motion.button>
      )}

      {/* Authentication Modal */}
      {showAuthModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          onClick={() => setShowAuthModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-stone-900 rounded-none p-8 max-w-md w-full mx-4 border border-stone-800 shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-600/10 border border-red-500/20 rounded-lg">
                  <Lock className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-2xl font-poppins-bold uppercase tracking-wide text-white">ACCESO</h3>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="p-2 hover:bg-stone-800 rounded-lg transition-colors duration-200"
              >
                <X className="w-5 h-5 text-gray-500 hover:text-white" />
              </button>
            </div>

            {selectedPose && (
              <div className="mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-16 h-16 bg-stone-800 border border-stone-700 flex items-center justify-center">
                    <div className="text-2xl">🔥</div>
                  </div>
                  <div>
                    <h4 className="text-white font-poppins-bold uppercase tracking-wider">{selectedPose.name}</h4>
                    <p className="text-gray-400 text-xs font-poppins-medium uppercase mt-1">{selectedPose.category}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center mb-8">
              <p className="text-gray-400 text-sm leading-relaxed font-poppins-medium">
                Para ver <span className="text-red-500 font-bold uppercase">poses detalladas</span> e instrucciones paso a paso necesitas estar registrado.
              </p>
              <p className="text-white text-xs mt-2 font-poppins-bold uppercase">
                Toma 10 segundos.
              </p>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleLogin}
                className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-700 text-white font-poppins-bold uppercase tracking-widest text-sm py-4 px-6 transition-all duration-200 shadow-lg shadow-red-900/40"
              >
                <LogIn className="w-5 h-5" />
                Iniciar Sesión
              </button>

              <button
                onClick={handleRegister}
                className="w-full flex items-center justify-center gap-3 bg-stone-800 hover:bg-stone-700 border border-stone-700 hover:border-red-500/50 text-white font-poppins-bold uppercase tracking-widest text-sm py-4 px-6 transition-all duration-200"
              >
                <UserPlus className="w-5 h-5" />
                Crear Cuenta
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-stone-800">
              <p className="text-center text-gray-500 text-xs font-poppins-medium uppercase">
                ¿Ya tienes cuenta? <button onClick={handleLogin} className="text-red-500 hover:text-red-400 font-bold ml-1">Inicia sesión</button>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}


    </div>
  );
};

export default PoseScroll;