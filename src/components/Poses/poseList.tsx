import { useState, useMemo } from 'react';
import PoseCard from './poseCard';
import PoseViewer from './poseViewer';

interface PoseStep {
  id: number;
  title: string;
  description: string;
  image?: string;
  tips?: string[];
  warnings?: string[];
}

interface Pose {
  id: string;
  name: string;
  description: string;
  image: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  category: string;
  duration: string;
  popularity: number;
  steps: PoseStep[];
  benefits: string[];
  requirements: string[];
  safetyTips: string[];
}

interface PoseFilters {
  difficulty: string;
  category: string;
  minPopularity: number;
  searchTerm: string;
}

interface PoseListProps {
  onBack?: () => void;
}

export default function PoseList({ onBack }: PoseListProps = {}) {
  const [selectedPose, setSelectedPose] = useState<Pose | null>(null);
  const [filters, setFilters] = useState<PoseFilters>({
    difficulty: '',
    category: '',
    minPopularity: 0,
    searchTerm: ''
  });
  const [sortBy, setSortBy] = useState<'name' | 'popularity' | 'difficulty'>('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Datos de ejemplo de poses
  const poses: Pose[] = [
    {
      id: '1',
      name: 'Misionero Clásico',
      description: 'La posición más tradicional y cómoda para principiantes',
      image: '/api/placeholder/400/300',
      difficulty: 'Principiante',
      category: 'Clásicas',
      duration: '15-30 min',
      popularity: 5,
      steps: [
        {
          id: 1,
          title: 'Preparación',
          description: 'Asegúrense de estar cómodos y relajados. Comuniquen sus preferencias.',
          tips: ['Usen lubricante si es necesario', 'Tómense su tiempo'],
          warnings: ['No fuercen ningún movimiento']
        },
        {
          id: 2,
          title: 'Posicionamiento',
          description: 'La pareja receptora se acuesta boca arriba, la pareja activa se posiciona encima.',
          tips: ['Mantengan contacto visual', 'Ajusten la posición según comodidad']
        }
      ],
      benefits: ['Intimidad emocional', 'Control del ritmo', 'Comodidad para principiantes'],
      requirements: ['Superficie cómoda', 'Privacidad', 'Comunicación abierta'],
      safetyTips: [
        'Comuniquen constantemente sus sensaciones',
        'Deténganse si sienten dolor o incomodidad',
        'Usen protección si es necesario'
      ]
    },
    {
      id: '2',
      name: 'Cucharita',
      description: 'Posición lateral íntima y relajante',
      image: '/api/placeholder/400/300',
      difficulty: 'Principiante',
      category: 'Relajantes',
      duration: '20-45 min',
      popularity: 4,
      steps: [
        {
          id: 1,
          title: 'Posicionamiento lateral',
          description: 'Ambos se acuestan de lado, uno detrás del otro.',
          tips: ['Ajusten la altura con almohadas', 'Mantengan contacto corporal'],
          warnings: ['Eviten presión excesiva en el cuello']
        }
      ],
      benefits: ['Relajación', 'Intimidad prolongada', 'Menos esfuerzo físico'],
      requirements: ['Cama amplia', 'Almohadas de apoyo'],
      safetyTips: [
        'Asegúrense de que ambos estén cómodos',
        'Cambien de posición si sienten entumecimiento'
      ]
    },
    {
      id: '3',
      name: 'Amazona',
      description: 'La pareja receptora toma el control desde arriba',
      image: '/api/placeholder/400/300',
      difficulty: 'Intermedio',
      category: 'Control',
      duration: '15-40 min',
      popularity: 4,
      steps: [
        {
          id: 1,
          title: 'Cambio de posiciones',
          description: 'La pareja activa se acuesta, la receptora se posiciona encima.',
          tips: ['Tómense tiempo para ajustarse', 'Usen las manos para apoyo'],
          warnings: ['Eviten movimientos bruscos']
        }
      ],
      benefits: ['Control del ritmo', 'Estimulación diferente', 'Empoderamiento'],
      requirements: ['Confianza mutua', 'Comunicación clara'],
      safetyTips: [
        'La persona de arriba controla la profundidad',
        'Comuniquen cualquier molestia inmediatamente'
      ]
    },
    {
      id: '4',
      name: 'Perrito',
      description: 'Posición desde atrás con múltiples variaciones',
      image: '/api/placeholder/400/300',
      difficulty: 'Intermedio',
      category: 'Intensas',
      duration: '10-25 min',
      popularity: 4,
      steps: [
        {
          id: 1,
          title: 'Posicionamiento',
          description: 'La pareja receptora se coloca en cuatro puntos, la activa detrás.',
          tips: ['Usen almohadas para comodidad', 'Ajusten la altura'],
          warnings: ['Controlen la profundidad y velocidad']
        }
      ],
      benefits: ['Estimulación intensa', 'Variedad de ángulos', 'Control para ambos'],
      requirements: ['Flexibilidad básica', 'Superficie estable'],
      safetyTips: [
        'Comuniquen constantemente',
        'Eviten movimientos demasiado vigorosos al inicio'
      ]
    },
    {
      id: '5',
      name: 'Loto',
      description: 'Posición sentada íntima y conectada',
      image: '/api/placeholder/400/300',
      difficulty: 'Avanzado',
      category: 'Tántricas',
      duration: '30-60 min',
      popularity: 3,
      steps: [
        {
          id: 1,
          title: 'Posición sentada',
          description: 'La pareja activa se sienta con piernas cruzadas, la receptora se sienta encima.',
          tips: ['Mantengan contacto visual', 'Sincronicen la respiración'],
          warnings: ['Requiere flexibilidad en caderas']
        }
      ],
      benefits: ['Conexión emocional profunda', 'Intimidad prolongada', 'Sincronización'],
      requirements: ['Flexibilidad', 'Paciencia', 'Conexión emocional'],
      safetyTips: [
        'No fuercen la posición si no son flexibles',
        'Tómense descansos si es necesario'
      ]
    },
    {
      id: '6',
      name: 'Mariposa',
      description: 'Posición elevada con estimulación intensa',
      image: '/api/placeholder/400/300',
      difficulty: 'Avanzado',
      category: 'Acrobáticas',
      duration: '10-20 min',
      popularity: 3,
      steps: [
        {
          id: 1,
          title: 'Elevación',
          description: 'La pareja receptora se acuesta al borde de la cama, la activa de pie.',
          tips: ['Ajusten la altura de la cama', 'Usen apoyo para las piernas'],
          warnings: ['Requiere fuerza y equilibrio']
        }
      ],
      benefits: ['Ángulo único', 'Estimulación profunda', 'Variedad'],
      requirements: ['Altura adecuada', 'Fuerza física', 'Equilibrio'],
      safetyTips: [
        'Asegúrense de tener buen equilibrio',
        'Usen superficies estables'
      ]
    }
  ];

  // Filtrar poses basado en los criterios seleccionados
  const filteredPoses = useMemo(() => {
    return poses.filter(pose => {
      const matchesDifficulty = !filters.difficulty || pose.difficulty === filters.difficulty;
      const matchesCategory = !filters.category || pose.category === filters.category;
      const matchesPopularity = pose.popularity >= filters.minPopularity;
      const matchesSearch = !filters.searchTerm || 
        pose.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
        pose.description.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      return matchesDifficulty && matchesCategory && matchesPopularity && matchesSearch;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'popularity':
          return b.popularity - a.popularity;
        case 'difficulty':
          const difficultyOrder = { 'Principiante': 1, 'Intermedio': 2, 'Avanzado': 3 };
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
        default:
          return 0;
      }
    });
  }, [poses, filters, sortBy]);

  // Obtener categorías únicas
  const categories = [...new Set(poses.map(pose => pose.category))];
  const difficulties = ['Principiante', 'Intermedio', 'Avanzado'];

  const handlePoseClick = (pose: Pose) => {
    setSelectedPose(pose);
  };

  const handleCloseViewer = () => {
    setSelectedPose(null);
  };

  const updateFilter = (key: keyof PoseFilters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      difficulty: '',
      category: '',
      minPopularity: 0,
      searchTerm: ''
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          {onBack && (
            <div className="flex justify-start mb-6">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Volver al inicio
              </button>
            </div>
          )}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Explorador de Poses Íntimas
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubre nuevas formas de conectar con tu pareja. Cada pose incluye instrucciones detalladas, 
            consejos de seguridad y beneficios para una experiencia placentera y segura.
          </p>
        </div>

        {/* Filtros y Controles */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {/* Búsqueda */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar poses..."
                  value={filters.searchTerm}
                  onChange={(e) => updateFilter('searchTerm', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Dificultad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dificultad
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) => updateFilter('difficulty', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Todas</option>
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={filters.category}
                onChange={(e) => updateFilter('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value="">Todas</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Popularidad */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Popularidad mínima
              </label>
              <select
                value={filters.minPopularity}
                onChange={(e) => updateFilter('minPopularity', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              >
                <option value={0}>Todas</option>
                <option value={3}>3+ estrellas</option>
                <option value={4}>4+ estrellas</option>
                <option value={5}>5 estrellas</option>
              </select>
            </div>
          </div>

          {/* Controles adicionales */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Ordenar por */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Ordenar por:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                >
                  <option value="popularity">Popularidad</option>
                  <option value="name">Nombre</option>
                  <option value="difficulty">Dificultad</option>
                </select>
              </div>

              {/* Modo de vista */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Vista:
                </label>
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-3 py-1 text-sm ${
                      viewMode === 'grid'
                        ? 'bg-pink-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 text-sm ${
                      viewMode === 'list'
                        ? 'bg-pink-500 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Limpiar filtros */}
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-pink-600">{filteredPoses.length}</div>
            <div className="text-sm text-gray-600">Poses encontradas</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-purple-600">{categories.length}</div>
            <div className="text-sm text-gray-600">Categorías</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-indigo-600">{difficulties.length}</div>
            <div className="text-sm text-gray-600">Niveles</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <div className="text-2xl font-bold text-green-600">
              {Math.round(filteredPoses.reduce((acc, pose) => acc + pose.popularity, 0) / filteredPoses.length * 10) / 10 || 0}
            </div>
            <div className="text-sm text-gray-600">Popularidad promedio</div>
          </div>
        </div>

        {/* Lista de poses */}
        {filteredPoses.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.175-5.5-2.709" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron poses</h3>
            <p className="text-gray-500 mb-4">Intenta ajustar los filtros para encontrar más resultados.</p>
            <button
              onClick={clearFilters}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              : 'grid-cols-1'
          }`}>
            {filteredPoses.map((pose) => (
              <PoseCard
                key={pose.id}
                id={pose.id}
                name={pose.name}
                description={pose.description}
                image={pose.image}
                difficulty={pose.difficulty}
                category={pose.category}
                duration={pose.duration}
                popularity={pose.popularity}
                onViewPose={() => handlePoseClick(pose)}
              />
            ))}
          </div>
        )}

        {/* Viewer Modal */}
        {selectedPose && (
          <PoseViewer
            pose={selectedPose}
            onClose={handleCloseViewer}
          />
        )}
      </div>
    </div>
  );
}