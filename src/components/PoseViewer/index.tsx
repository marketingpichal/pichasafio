import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye, Star, ArrowLeft, Share2, Bookmark, ChevronLeft, ChevronRight, ArrowUp } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

import { getPoseImages, PoseImage } from '../../lib/cloudinaryService';


interface Pose {
  id: number;
  name: string;
  category: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  rating: number;
  views: number;
  likes: number;
  images: string[];
  cloudinaryImages: PoseImage[];
  description: string;
  benefits: string[];
  instructions: string[];
  tips: string[];
  duration: string;
  isLiked: boolean;
  isBookmarked: boolean;
}

const generatePose = async (id: number): Promise<Pose> => {
  const categories = ['Clásicas', 'Románticas', 'Aventureras', 'Íntimas', 'Experimentales'];
  const difficulties: ('Principiante' | 'Intermedio' | 'Avanzado')[] = ['Principiante', 'Intermedio', 'Avanzado'];
  
  // Obtener imágenes reales de Supabase Storage
  let cloudinaryImages: PoseImage[] = [];
  try {
    const response = await getPoseImages();
    cloudinaryImages = response || [];
    // console.log('📊 Supabase images loaded:', cloudinaryImages.length);
  } catch (error) {
    console.error('💥 Error loading Supabase images:', error);
  }
  
  // Seleccionar imágenes para esta pose
  let selectedImages: PoseImage[] = [];
  let imageUrls: string[] = [];
  
  // Usar imágenes de Supabase Storage si están disponibles
  if (cloudinaryImages.length > 0) {
    // console.log('✅ Using real Supabase Storage images');
    // Seleccionar 3 imágenes
    const imageIndex1 = (id - 1) % cloudinaryImages.length;
    const imageIndex2 = id % cloudinaryImages.length;
    const imageIndex3 = (id + 1) % cloudinaryImages.length;
    
    selectedImages = [
      cloudinaryImages[imageIndex1],
      cloudinaryImages[imageIndex2],
      cloudinaryImages[imageIndex3]
    ].filter(img => img && img.url); // Filtrar imágenes válidas
    
    imageUrls = selectedImages.map(img => img.url);
  } else {
    // console.log('⚠️ No Supabase images available, using fallback');
    // Fallback a URLs directas si no hay imágenes de Supabase
    imageUrls = [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop'
    ];
    selectedImages = []; // Asegurar que selectedImages esté vacío cuando usamos fallback
  }
  
  
  
  return {
    id,
    name: `Pose ${id}`,
    category: categories[Math.floor(Math.random() * categories.length)],
    difficulty: difficulties[Math.floor(Math.random() * difficulties.length)],
    rating: Math.floor(Math.random() * 2) + 4,
    views: Math.floor(Math.random() * 10000) + 1000,
    likes: Math.floor(Math.random() * 1000) + 100,
    images: imageUrls,
    cloudinaryImages: selectedImages,
    description: `Una pose íntima y apasionada que fortalece la conexión emocional entre la pareja. La ${id % 2 === 0 ? 'comunicación' : 'confianza'} es clave para disfrutar plenamente de esta experiencia.`,
    benefits: [
      'Mejora la intimidad emocional',
      'Fortalece la conexión física',
      'Aumenta la confianza mutua',
      'Estimula la comunicación',
      'Reduce el estrés'
    ],
    instructions: [
      'Comenzar con caricias suaves y contacto visual',
      'Comunicarse constantemente sobre las sensaciones',
      'Mantener un ritmo cómodo para ambos',
      'Prestar atención a las reacciones de la pareja',
      'Disfrutar del momento sin presiones'
    ],
    tips: [
      'Usar lubricante si es necesario',
      'Mantener una comunicación abierta',
      'Tomarse el tiempo necesario',
      'Crear un ambiente relajado',
      'Respetar los límites de ambos'
    ],
    duration: `${Math.floor(Math.random() * 20) + 10}-${Math.floor(Math.random() * 20) + 30} minutos`,
    isLiked: Math.random() > 0.7,
    isBookmarked: Math.random() > 0.8
  };
};

const generateRelatedPoses = async (currentId: number, startId: number, count: number): Promise<Pose[]> => {
  const poses: Pose[] = [];
  for (let i = 0; i < count; i++) {
    const id = startId + i;
    if (id !== currentId) {
      poses.push(await generatePose(id));
    }
  }
  return poses;
};

const PoseViewer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [pose, setPose] = useState<Pose | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [relatedPoses, setRelatedPoses] = useState<Pose[]>([]);
  const [loading, setLoading] = useState(false);
  const [poseLoading, setPoseLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Cargar pose actual
  useEffect(() => {
    if (id) {
      const loadPose = async () => {
        try {
          setPoseLoading(true);
          const poseData = await generatePose(parseInt(id));
          setPose(poseData);
          // Incrementar vistas
          poseData.views += 1;
        } catch (error) {
          console.error('Error loading pose:', error);
          // En caso de error, crear una pose básica
          const fallbackPose: Pose = {
            id: parseInt(id),
            name: `Pose ${id}`,
            category: 'Clásicas',
            difficulty: 'Principiante',
            rating: 4,
            views: 1000,
            likes: 100,
            images: [
              'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
              'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=300&fit=crop'
            ],
            cloudinaryImages: [],
            description: 'Una pose íntima y apasionada que fortalece la conexión emocional entre la pareja.',
            benefits: ['Mejora la intimidad', 'Fortalece la conexión emocional'],
            instructions: ['Comunicación constante', 'Movimientos suaves'],
            tips: ['Mantén el contacto visual', 'Respira profundamente'],
            duration: '15-20 min',
            isLiked: false,
            isBookmarked: false
          };
          setPose(fallbackPose);
        } finally {
          setPoseLoading(false);
        }
      };
      loadPose();
    }
  }, [id]);

  // Cargar poses relacionadas iniciales
  useEffect(() => {
    if (id) {
      const loadRelatedPoses = async () => {
        const currentId = parseInt(id);
        const initialRelated = await generateRelatedPoses(currentId, 1, 8);
        setRelatedPoses(initialRelated);
      };
      loadRelatedPoses();
    }
  }, [id]);

  // Detectar scroll para mostrar botón de volver arriba
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cargar más poses relacionadas
  const loadMoreRelatedPoses = useCallback(() => {
    if (loading || !hasMore || !id) return;

    setLoading(true);
    
    setTimeout(async () => {
      const currentId = parseInt(id);
      const newPoses = await generateRelatedPoses(currentId, relatedPoses.length + 100, 6);
      setRelatedPoses(prev => [...prev, ...newPoses]);
      setLoading(false);
      
      if (relatedPoses.length >= 50) {
        setHasMore(false);
      }
    }, 1000);
  }, [id, relatedPoses.length, loading, hasMore]);

  // Detectar scroll infinito
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop 
          >= document.documentElement.offsetHeight - 1000) {
        loadMoreRelatedPoses();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMoreRelatedPoses]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const nextImage = () => {
    if (pose) {
      setCurrentImageIndex((prev) => (prev + 1) % pose.images.length);
    }
  };

  const prevImage = () => {
    if (pose) {
      setCurrentImageIndex((prev) => (prev - 1 + pose.images.length) % pose.images.length);
    }
  };

  const handleLike = () => {
    if (pose) {
      setPose(prev => prev ? {
        ...prev,
        isLiked: !prev.isLiked,
        likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
      } : null);
    }
  };

  const handleBookmark = () => {
    if (pose) {
      setPose(prev => prev ? {
        ...prev,
        isBookmarked: !prev.isBookmarked
      } : null);
    }
  };

  const handleRelatedPoseClick = (relatedPose: Pose) => {
    navigate(`/pose/${relatedPose.id}`);
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
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-400'
        }`}
      />
    ));
  };

  if (poseLoading || !pose) {
    return (
      <div className="bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full"></div>
          <div className="text-white text-xl font-poppins-light">Cargando pose...</div>
        </div>
      </div>
    );
  }



  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-poppins-light">Volver</span>
            </button>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleLike}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                  pose.isLiked 
                    ? 'bg-pink-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Heart className={`w-4 h-4 ${pose.isLiked ? 'fill-current' : ''}`} />
                <span className="text-sm font-poppins-light">{pose.likes}</span>
              </button>
              
              <button
                onClick={handleBookmark}
                className={`p-2 rounded-lg transition-all duration-200 ${
                  pose.isBookmarked 
                    ? 'bg-yellow-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${pose.isBookmarked ? 'fill-current' : ''}`} />
              </button>
              
              <button className="p-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg transition-all duration-200">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pose Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] bg-gray-800 rounded-xl overflow-hidden">
              {pose.images && pose.images.length > 0 && pose.images[currentImageIndex] ? (
                <img
                  src={pose.images[currentImageIndex]}
                  alt={pose.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    const fallbackDiv = e.currentTarget.parentElement?.querySelector('.fallback-emoji');
                    e.currentTarget.style.display = 'none';
                    if (fallbackDiv) {
                      fallbackDiv.classList.remove('hidden');
                    }
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center">
                  <div className="text-8xl opacity-50">💕</div>
                </div>
              )}
              <div className="fallback-emoji w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center hidden absolute inset-0">
                <div className="text-8xl opacity-50">💕</div>
              </div>
              
              {pose.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-200"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-black/50 backdrop-blur-sm text-white rounded-full flex items-center justify-center hover:bg-black/70 transition-all duration-200"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {pose.images.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-200 ${
                          index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${getDifficultyColor(pose.difficulty)}`}>
                  {pose.difficulty}
                </div>
                <div className="bg-gray-700 px-3 py-1 rounded-full text-sm text-gray-300">
                  {pose.category}
                </div>
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 font-poppins-bold">
                {pose.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {renderStars(pose.rating)}
                  <span className="text-gray-400 text-sm ml-1">({pose.rating})</span>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    <span>{pose.views.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    <span>{pose.likes}</span>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-300 text-lg leading-relaxed font-poppins-light">
                {pose.description}
              </p>
            </div>

            {/* Duration */}
            <div className="bg-gray-800 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-2 font-poppins-semibold">Duración Recomendada</h3>
              <p className="text-gray-300 font-poppins-light">{pose.duration}</p>
            </div>

            {/* Benefits */}
            <div className="bg-gray-800 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3 font-poppins-semibold">Beneficios</h3>
              <div className="flex flex-wrap gap-2">
                {pose.benefits.map((benefit, index) => (
                  <span
                    key={index}
                    className="bg-purple-900/30 text-purple-300 px-3 py-1 rounded-full text-sm font-poppins-light"
                  >
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 font-poppins-bold">Instrucciones Paso a Paso</h3>
            <ol className="space-y-3">
              {pose.instructions.map((instruction, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-gray-300 font-poppins-light">{instruction}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="bg-gray-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-white mb-4 font-poppins-bold">Consejos de Expertos</h3>
            <ul className="space-y-3">
              {pose.tips.map((tip, index) => (
                <li key={index} className="flex gap-3">
                  <span className="flex-shrink-0 w-2 h-2 bg-yellow-400 rounded-full mt-2"></span>
                  <span className="text-gray-300 font-poppins-light">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Related Poses */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 font-poppins-bold">Poses Relacionadas</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedPoses.map((relatedPose, index) => (
              <motion.div
                key={relatedPose.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-750 transition-all duration-300 group cursor-pointer"
                onClick={() => handleRelatedPoseClick(relatedPose)}
              >
                <div className="relative aspect-[4/3] bg-gray-700 overflow-hidden">
                  {relatedPose.images && relatedPose.images.length > 0 ? (
                    <img
                      src={relatedPose.images[0]}
                      alt={relatedPose.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 flex items-center justify-center hidden">
                    <div className="text-6xl opacity-50">💕</div>
                  </div>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300" />
                  
                  <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold text-white ${getDifficultyColor(relatedPose.difficulty)}`}>
                    {relatedPose.difficulty}
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-white font-semibold mb-2 font-poppins-semibold group-hover:text-pink-300 transition-colors">
                    {relatedPose.name}
                  </h3>
                  
                  <div className="flex items-center gap-1 mb-2">
                    {renderStars(relatedPose.rating)}
                    <span className="text-gray-400 text-xs ml-1">({relatedPose.rating})</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        <span>{relatedPose.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        <span>{relatedPose.likes}</span>
                      </div>
                    </div>
                  </div>
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
                ¡Has visto todas las poses relacionadas! 🎉
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 z-50"
        >
          <ArrowUp className="w-6 h-6" />
        </motion.button>
      )}
    </div>
  );
};

export default PoseViewer;