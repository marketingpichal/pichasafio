import { useState } from 'react';
import GuideCard from './guideCard';
import GuideViewer from './guideViewer';

interface GuideStep {
  id: number;
  title: string;
  content: string;
  image?: string;
  tips?: string[];
}

interface Guide {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  duration: string;
  steps: GuideStep[];
  benefits: string[];
  requirements: string[];
}

export default function GuideStore() {
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('Todos');

  // Datos de ejemplo de guías
  const guides: Guide[] = [
    {
      id: '1',
      title: 'Guía Completa para Principiantes',
      description: 'Todo lo que necesitas saber para empezar en el mundo del placer íntimo',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      price: '$19.99',
      difficulty: 'Principiante',
      duration: '2-3 horas',
      benefits: [
        'Conocimiento básico sobre productos íntimos',
        'Consejos de seguridad e higiene',
        'Recomendaciones personalizadas',
        'Guía de compra inteligente'
      ],
      requirements: [
        'Mente abierta y sin prejuicios',
        'Privacidad para leer con tranquilidad',
        'Ganas de aprender y explorar'
      ],
      steps: [
        {
          id: 1,
          title: 'Introducción al mundo íntimo',
          content: 'Bienvenido a tu viaje de autodescubrimiento. En esta primera lección aprenderás los conceptos básicos y desmitificaremos algunos tabúes comunes.\n\nEs importante entender que la exploración íntima es completamente natural y saludable. Cada persona tiene diferentes preferencias y necesidades.',
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
          tips: [
            'Tómate tu tiempo para absorber la información',
            'No hay preguntas tontas, todo es válido',
            'Mantén una actitud positiva y sin juicios'
          ]
        },
        {
          id: 2,
          title: 'Tipos de productos y sus usos',
          content: 'Exploraremos los diferentes tipos de productos disponibles en el mercado, sus características principales y para qué situaciones son más adecuados.\n\nCada categoría de producto tiene sus propias ventajas y consideraciones especiales que debes conocer antes de hacer una compra.',
          tips: [
            'Investiga antes de comprar',
            'Lee reseñas de otros usuarios',
            'Considera tu nivel de experiencia'
          ]
        },
        {
          id: 3,
          title: 'Seguridad e higiene',
          content: 'La seguridad debe ser siempre tu prioridad número uno. Aprenderás las mejores prácticas para mantener una experiencia segura y saludable.\n\nCubriremos temas como limpieza, almacenamiento adecuado y señales de advertencia a tener en cuenta.',
          tips: [
            'Siempre limpia antes y después del uso',
            'Usa productos de calidad certificada',
            'Escucha a tu cuerpo y detente si algo no se siente bien'
          ]
        }
      ]
    },
    {
      id: '2',
      title: 'Técnicas Avanzadas de Placer',
      description: 'Lleva tu experiencia al siguiente nivel con técnicas profesionales',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      price: '$29.99',
      difficulty: 'Avanzado',
      duration: '4-5 horas',
      benefits: [
        'Técnicas avanzadas y especializadas',
        'Maximización del placer y satisfacción',
        'Consejos de expertos en la materia',
        'Estrategias para parejas'
      ],
      requirements: [
        'Experiencia previa básica',
        'Conocimiento de productos básicos',
        'Comunicación abierta con la pareja (si aplica)'
      ],
      steps: [
        {
          id: 1,
          title: 'Técnicas de respiración y relajación',
          content: 'La respiración correcta es fundamental para una experiencia plena. Aprenderás técnicas específicas que te ayudarán a relajarte y conectar mejor contigo mismo.\n\nEstas técnicas han sido utilizadas durante siglos en diferentes culturas y tienen beneficios comprobados.',
          tips: [
            'Practica en un ambiente tranquilo',
            'No te presiones, cada persona es diferente',
            'La constancia es clave para ver resultados'
          ]
        },
        {
          id: 2,
          title: 'Exploración sensorial avanzada',
          content: 'Descubre cómo involucrar todos tus sentidos para crear experiencias más ricas y satisfactorias.\n\nAprenderás sobre la importancia del tacto, el olfato, la vista y el oído en la creación de ambientes íntimos.',
          tips: [
            'Experimenta con diferentes texturas',
            'Crea ambientes con iluminación adecuada',
            'Usa aromas que te relajen y estimulen'
          ]
        }
      ]
    },
    {
      id: '3',
      title: 'Comunicación en Pareja',
      description: 'Mejora la comunicación íntima con tu pareja para experiencias más satisfactorias',
      image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      price: '$24.99',
      difficulty: 'Intermedio',
      duration: '3-4 horas',
      benefits: [
        'Mejor comunicación con tu pareja',
        'Aumento de la confianza mutua',
        'Experiencias más satisfactorias',
        'Resolución de conflictos íntimos'
      ],
      requirements: [
        'Estar en una relación o tener pareja',
        'Disposición para comunicarse abiertamente',
        'Respeto mutuo y confianza básica'
      ],
      steps: [
        {
          id: 1,
          title: 'Fundamentos de la comunicación íntima',
          content: 'La base de cualquier relación saludable es la comunicación abierta y honesta. Aprenderás cómo crear un espacio seguro para hablar sobre temas íntimos.\n\nExploraremos técnicas de escucha activa y expresión de necesidades sin generar conflictos.',
          tips: [
            'Elige el momento y lugar adecuados',
            'Usa un lenguaje positivo y no acusatorio',
            'Escucha sin juzgar'
          ]
        },
        {
          id: 2,
          title: 'Expresando deseos y límites',
          content: 'Aprende a comunicar tus deseos de manera clara y respetuosa, así como a establecer límites saludables.\n\nTambién cubriremos cómo recibir y procesar la información que tu pareja comparte contigo.',
          tips: [
            'Sé específico sobre lo que te gusta',
            'Respeta los límites de tu pareja',
            'La comunicación es un proceso continuo'
          ]
        }
      ]
    },
    {
      id: '4',
      title: 'Cuidado y Mantenimiento de Productos',
      description: 'Aprende a cuidar adecuadamente tus productos para mayor durabilidad y seguridad',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      price: '$14.99',
      difficulty: 'Principiante',
      duration: '1-2 horas',
      benefits: [
        'Mayor durabilidad de tus productos',
        'Uso más seguro e higiénico',
        'Ahorro de dinero a largo plazo',
        'Conocimiento sobre materiales y compatibilidad'
      ],
      requirements: [
        'Tener productos íntimos para practicar',
        'Acceso a productos de limpieza básicos',
        'Espacio adecuado para almacenamiento'
      ],
      steps: [
        {
          id: 1,
          title: 'Limpieza y desinfección',
          content: 'La limpieza adecuada es esencial para tu salud y la durabilidad de tus productos. Aprenderás qué productos usar y cuáles evitar.\n\nCada material requiere un cuidado específico, y conocer estas diferencias te ayudará a mantener todo en perfectas condiciones.',
          tips: [
            'Limpia antes y después de cada uso',
            'Usa jabones neutros sin fragancias',
            'Evita productos con alcohol o químicos agresivos'
          ]
        }
      ]
    }
  ];

  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'Todos' || guide.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const handleViewGuide = (guide: Guide) => {
    setSelectedGuide(guide);
  };

  const handleCloseViewer = () => {
    setSelectedGuide(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Tienda de Guías Íntimas
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubre guías profesionales para mejorar tu bienestar íntimo y relaciones personales
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Buscar guías..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex gap-2">
            {['Todos', 'Principiante', 'Intermedio', 'Avanzado'].map((level) => (
              <button
                key={level}
                onClick={() => setDifficultyFilter(level)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  difficultyFilter === level
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-purple-50 border border-gray-200'
                }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{guides.length}</p>
                <p className="text-gray-600">Guías Disponibles</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">100%</p>
                <p className="text-gray-600">Satisfacción</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">5K+</p>
                <p className="text-gray-600">Usuarios Activos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Guides Grid */}
        {filteredGuides.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGuides.map((guide) => (
              <GuideCard
                key={guide.id}
                id={guide.id}
                title={guide.title}
                description={guide.description}
                image={guide.image}
                price={guide.price}
                difficulty={guide.difficulty}
                duration={guide.duration}
                onViewGuide={() => handleViewGuide(guide)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.5-.816-6.207-2.175C5.25 12.09 5.25 11.91 5.25 11.709V6.375c0-1.036.84-1.875 1.875-1.875h8.25c1.035 0 1.875.84 1.875 1.875v5.334c0 .201 0 .381-.043.617A7.962 7.962 0 0112 15z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontraron guías</h3>
            <p className="text-gray-500">Intenta ajustar tus filtros de búsqueda</p>
          </div>
        )}

        {/* Guide Viewer Modal */}
        {selectedGuide && (
          <GuideViewer
            guide={selectedGuide}
            onClose={handleCloseViewer}
          />
        )}
      </div>
    </div>
  );
}