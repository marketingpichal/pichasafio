import React from "react";
import RewardedAdGate from "../common/RewardedAdGate";
import { logAdEvent, trackUserAdImpression } from "@/lib/adTracking";
import { useAuth } from "@/context/AuthProvider";
import { motion } from "framer-motion";
import ResponsiveCard from "../common/ResponsiveCard";
import { Calendar, Play, Target, Trophy, Clock, Star } from "lucide-react";

interface Exercise {
  name: string;
  url: string;
  description?: string;
  embedUrl?: string;
  duration?: string;
  difficulty?: string;
}

interface DayProps {
  day: number;
  exercise: Exercise;
  onClick: (day: number) => void;
  isActive?: boolean;
}

const exercises: Exercise[] = [
  {
    name: "Dry Jelq",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/dry-jelq.webm?view=1",
    description: "Ejercicio básico de jelqing seco para aumentar el tamaño del pene de forma natural y segura",
    duration: "15-20 minutos",
    difficulty: "Principiante",
  },
  {
    name: "Jelq Squeeze",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/jelq-squeeze.webm?view=1",
    description: "Jelqing con técnica de squeeze para maximizar el flujo sanguíneo y resultados",
    duration: "20-25 minutos",
    difficulty: "Intermedio",
  },
  {
    name: "ULI Basic",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/uli3.webm?view=1",
    description: "Ejercicio ULI básico para fortalecer y aumentar el grosor del pene",
    duration: "10-15 minutos",
    difficulty: "Intermedio",
  },
  {
    name: "Extreme ULI",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/extreme-uli.webm?view=1",
    description: "Versión avanzada del ULI para usuarios experimentados que buscan resultados extremos",
    duration: "15-20 minutos",
    difficulty: "Avanzado",
  },
  {
    name: "Plumped Bend",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/plumped-bend.webm?view=1",
    description: "Ejercicio de flexión para mejorar la elasticidad y curvatura natural",
    duration: "12-18 minutos",
    difficulty: "Intermedio",
  },
  {
    name: "Sadsak Slinky",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/sadsak-slinky.webm?view=1",
    description: "Técnica Sadsak Slinky para elongación progresiva y resultados duraderos",
    duration: "25-30 minutos",
    difficulty: "Avanzado",
  },
  {
    name: "Manual Stretches",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/simple-manual-stretches.webm?view=1",
    description: "Estiramientos manuales básicos para principiantes, seguros y efectivos",
    duration: "10-15 minutos",
    difficulty: "Principiante",
  },
  {
    name: "BTC Stretch",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/btc-stretch.webm?view=1",
    description: "Estiramiento BTC (Behind The Cheeks) para elongación profunda",
    duration: "15-20 minutos",
    difficulty: "Intermedio",
  },
  {
    name: "JAI Stretch",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/jai-stretch.webm?view=1",
    description: "Estiramiento JAI para mejorar la longitud y flexibilidad",
    duration: "18-25 minutos",
    difficulty: "Intermedio",
  },
  {
    name: "V-Stretch",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/v-stretch.webm?view=1",
    description: "Estiramiento en V para trabajar múltiples ángulos simultáneamente",
    duration: "20-30 minutos",
    difficulty: "Avanzado",
  },
  {
    name: "Inverted V-Stretch",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/inverted-v-a-stretch.webm?view=1",
    description: "Estiramiento en V invertida para máxima elongación y resultados",
    duration: "25-35 minutos",
    difficulty: "Avanzado",
  },
];

const Day: React.FC<DayProps> = ({ day, exercise, onClick, isActive }) => {
  return (
    <motion.article
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onClick(day)}
      className={`p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 text-center ${
        isActive
          ? "border-pink-500 bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg"
          : "border-gray-600 bg-gray-800 hover:border-pink-400 hover:bg-gray-700 text-gray-300 hover:text-white"
      }`}
      role="button"
      aria-label={`Ejercicio del día ${day}: ${exercise.name}`}
      tabIndex={0}
    >
      <header>
        <h3 className="font-bold text-lg mb-1">Día {day}</h3>
      </header>
      <p className="text-xs sm:text-sm opacity-90">{exercise.name}</p>
    </motion.article>
  );
};

const Chochasafio: React.FC = () => {
  const totalDays = 30;
  const [currentVideo, setCurrentVideo] = React.useState<string>("");
  const [currentExercise, setCurrentExercise] = React.useState<Exercise | null>(
    null
  );
  const [showVideo, setShowVideo] = React.useState<boolean>(false);
  const [selectedDay, setSelectedDay] = React.useState<number | null>(null);
  const [showAdGate, setShowAdGate] = React.useState<boolean>(false);
  const pendingRef = React.useRef<{ day: number; exercise: Exercise } | null>(
    null
  );
  const { user } = useAuth();

  const getExerciseForDay = (day: number): Exercise => {
    const exerciseIndex = (day - 1) % exercises.length;
    return exercises[exerciseIndex];
  };

  const shouldGateForDay = (day: number): boolean => {
    return day % 3 === 0;
  };

  const unlockVideo = (day: number, exercise: Exercise) => {
    setCurrentExercise(exercise);
    setCurrentVideo(exercise.embedUrl || exercise.url);
    setShowVideo(true);
    setSelectedDay(day);
  };

  const handleDayClick = (day: number) => {
    const exercise = getExerciseForDay(day);
    if (shouldGateForDay(day)) {
      pendingRef.current = { day, exercise };
      setShowAdGate(true);
      logAdEvent("gate_required", {
        user_id: user?.id ?? null,
        provider: "juicyads",
        ad_zone:
          window.matchMedia && window.matchMedia("(max-width: 768px)").matches
            ? "1098249"
            : "1098247",
        context: { day, exerciseName: exercise.name },
      }).catch(() => void 0);
      return;
    }
    unlockVideo(day, exercise);
  };

  // Estructura de datos para SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": "Chochasafio de 30 Días - Programa de Ejercicios para Aumentar el Tamaño del Pene",
    "description": "Programa completo de 30 días con ejercicios específicos para aumentar el tamaño del pene de forma natural y segura. Incluye 11 ejercicios diferentes con videos instructivos.",
    "provider": {
      "@type": "Organization",
      "name": "Pichasafio",
      "url": "https://pichasafio.com"
    },
    "coursePrerequisites": "Ninguno - Programa para principiantes",
    "educationalLevel": "Principiante a Avanzado",
    "timeRequired": "PT30D",
    "numberOfItems": 30,
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "inLanguage": "es"
    }
  };

  return (
    <>
      {/* Estructura de datos JSON-LD para SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <main className="min-h-screen bg-gray-900 py-8 sm:py-12" role="main">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Principal */}
          <header className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text-extended mb-4">
                Chochasafio de 30 Días - Programa Completo de Ejercicios
              </h1>
              <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed">
                Completa este desafío de 30 días y transforma tu vida. Cada día
                tiene un ejercicio específico diseñado para maximizar tus
                resultados de forma natural y segura.
              </p>
            </motion.div>
          </header>

          {/* Estadísticas del Programa */}
          <section aria-labelledby="program-stats" className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <ResponsiveCard className="text-center">
                <div className="flex justify-center mb-4">
                  <Calendar className="w-8 h-8 text-pink-400" />
                </div>
                <h2 id="program-stats" className="text-2xl font-bold text-white mb-2">30</h2>
                <p className="text-gray-300 text-sm">Días de Entrenamiento</p>
              </ResponsiveCard>

              <ResponsiveCard className="text-center">
                <div className="flex justify-center mb-4">
                  <Target className="w-8 h-8 text-pink-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">11</h3>
                <p className="text-gray-300 text-sm">Ejercicios Diferentes</p>
              </ResponsiveCard>

              <ResponsiveCard className="text-center">
                <div className="flex justify-center mb-4">
                  <Trophy className="w-8 h-8 text-pink-400" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">100%</h3>
                <p className="text-gray-300 text-sm">Resultados Garantizados</p>
              </ResponsiveCard>
            </motion.div>
          </section>

          {/* Información Adicional SEO */}
          <section className="mb-12">
            <ResponsiveCard>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Clock className="w-6 h-6 text-pink-400 mr-2" />
                    ¿Qué Incluye el Programa?
                  </h2>
                  <ul className="text-gray-300 space-y-2">
                    <li>• 30 días de ejercicios progresivos</li>
                    <li>• Videos instructivos detallados</li>
                    <li>• Ejercicios para principiantes y avanzados</li>
                    <li>• Técnicas probadas y seguras</li>
                    <li>• Seguimiento de progreso</li>
                  </ul>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                    <Star className="w-6 h-6 text-pink-400 mr-2" />
                    Beneficios del Programa
                  </h2>
                  <ul className="text-gray-300 space-y-2">
                    <li>• Aumento natural del tamaño</li>
                    <li>• Mejora de la confianza</li>
                    <li>• Ejercicios sin equipos costosos</li>
                    <li>• Resultados permanentes</li>
                    <li>• Programa científicamente validado</li>
                  </ul>
                </div>
              </div>
            </ResponsiveCard>
          </section>

          {/* Calendario de Entrenamiento */}
          <section aria-labelledby="training-calendar" className="mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <ResponsiveCard
                title="Calendario de Entrenamiento de 30 Días"
                subtitle="Haz clic en cualquier día para ver el ejercicio correspondiente con video instructivo"
              >
                <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-3 sm:gap-4">
                  {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
                    <Day
                      key={day}
                      day={day}
                      exercise={getExerciseForDay(day)}
                      onClick={handleDayClick}
                      isActive={selectedDay === day}
                    />
                  ))}
                </div>
              </ResponsiveCard>
            </motion.div>
          </section>

          {/* Sección de Video */}
          {showVideo && currentExercise && (
            <section aria-labelledby="exercise-video" className="mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <ResponsiveCard
                  title={`Día ${selectedDay}: ${currentExercise.name} - Ejercicio Completo`}
                  subtitle={currentExercise.description}
                >
                  <div className="space-y-6">
                    <header className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                        <Play className="w-4 h-4 text-white" />
                      </div>
                      <h3 id="exercise-video" className="text-xl font-semibold text-white">
                        Ejercicio del Día {selectedDay}: {currentExercise.name}
                      </h3>
                    </header>

                    <div className="flex justify-center">
                      <div className="w-full max-w-4xl">
                        {currentExercise.embedUrl ? (
                          <iframe
                            src={currentExercise.embedUrl}
                            frameBorder={0}
                            marginWidth={0}
                            marginHeight={0}
                            scrolling="no"
                            width="100%"
                            height="400"
                            allowFullScreen
                            className="rounded-xl shadow-lg"
                            title={`Video instructivo: ${currentExercise.name}`}
                          />
                        ) : (
                          <video
                            controls
                            src={currentVideo}
                            className="w-full rounded-xl shadow-lg"
                            style={{ maxHeight: "400px" }}
                            title={`Video instructivo: ${currentExercise.name}`}
                          >
                            <track kind="captions" />
                            Tu navegador no soporta el elemento de video.
                          </video>
                        )}
                      </div>
                    </div>

                    <article className="bg-gray-800/50 rounded-xl p-4">
                      <h4 className="font-semibold text-white mb-2">
                        Instrucciones Detalladas:
                      </h4>
                      <p className="text-gray-300 text-sm leading-relaxed mb-4">
                        {currentExercise.description ||
                          "Sigue las instrucciones del video cuidadosamente. Realiza el ejercicio de manera controlada y respeta los tiempos de descanso."}
                      </p>
                      
                      {currentExercise.duration && (
                        <div className="flex items-center text-gray-300 text-sm mb-2">
                          <Clock className="w-4 h-4 mr-2" />
                          <span>Duración: {currentExercise.duration}</span>
                        </div>
                      )}
                      
                      {currentExercise.difficulty && (
                        <div className="flex items-center text-gray-300 text-sm">
                          <Target className="w-4 h-4 mr-2" />
                          <span>Nivel: {currentExercise.difficulty}</span>
                        </div>
                      )}
                    </article>
                  </div>
                </ResponsiveCard>
              </motion.div>
            </section>
          )}

          {/* Rewarded Ad Gate */}
          {showAdGate && (
            <RewardedAdGate
              isOpen={showAdGate}
              onClose={() => setShowAdGate(false)}
              onReward={() => {
                const pending = pendingRef.current;
                if (!pending) return;
                trackUserAdImpression(user?.id ?? null);
                logAdEvent("gate_rewarded", {
                  user_id: user?.id ?? null,
                  provider: "juicyads",
                  context: {
                    day: pending.day,
                    exerciseName: pending.exercise.name,
                  },
                }).catch(() => void 0);
                unlockVideo(pending.day, pending.exercise);
                pendingRef.current = null;
              }}
              videoContext={{
                day: pendingRef.current?.day,
                exerciseName: pendingRef.current?.exercise.name,
              }}
            />
          )}

          {/* Call to Action */}
          <section aria-labelledby="cta-section" className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <ResponsiveCard className="max-w-2xl mx-auto">
                <div className="space-y-4">
                  <h2 id="cta-section" className="text-2xl font-bold gradient-text mb-4">
                    ¡Comienza tu Desafío de 30 Días Hoy!
                  </h2>
                  <p className="text-gray-300 leading-relaxed">
                    Selecciona el día 1 y comienza tu transformación. Recuerda ser
                    consistente y seguir las instrucciones al pie de la letra para obtener los mejores resultados.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                    <button
                      onClick={() => handleDayClick(1)}
                      className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
                      aria-label="Comenzar el día 1 del programa de ejercicios"
                    >
                      Comenzar Día 1
                    </button>
                    <button 
                      className="bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-600 transform hover:scale-105 transition-all duration-200"
                      aria-label="Ver progreso del programa"
                    >
                      Ver Progreso
                    </button>
                  </div>
                </div>
              </ResponsiveCard>
            </motion.div>
          </section>

          {/* Información Adicional para SEO */}
          <section className="mt-12">
            <ResponsiveCard>
              <h2 className="text-2xl font-bold text-white mb-6">Preguntas Frecuentes sobre el Chochasafio</h2>
              <div className="space-y-6">
                <article>
                  <h3 className="text-lg font-semibold text-white mb-2">¿Cuánto tiempo toma ver resultados?</h3>
                  <p className="text-gray-300">Los primeros resultados suelen ser visibles después de 2-3 semanas de práctica consistente. Los resultados completos se obtienen al finalizar los 30 días.</p>
                </article>
                <article>
                  <h3 className="text-lg font-semibold text-white mb-2">¿Es seguro este programa?</h3>
                  <p className="text-gray-300">Sí, todos los ejercicios están diseñados para ser seguros cuando se realizan correctamente. Es importante seguir las instrucciones del video y no exceder los tiempos recomendados.</p>
                </article>
                <article>
                  <h3 className="text-lg font-semibold text-white mb-2">¿Necesito algún equipo especial?</h3>
                  <p className="text-gray-300">No, todos los ejercicios son manuales y no requieren equipos costosos. Solo necesitas tus manos y dedicación.</p>
                </article>
              </div>
            </ResponsiveCard>
          </section>
        </div>
        
        {/* Coming Soon Message - Solo se muestra si el usuario no está logueado */}
        {!user && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-8 rounded-xl max-w-md mx-4 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">
                Ejercicios Disponibles Pronto
              </h2>
              <p className="text-gray-300 mb-6">
                crea tu cuenta y mantente pendiente de los próximos ejercicios.
              </p>
              <button
                onClick={() => (window.location.href = "/register")}
                className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
              >
                Registrate ahora mismo
              </button>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Chochasafio;
