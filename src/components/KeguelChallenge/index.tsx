import React from "react";
import { motion } from "framer-motion";
import ResponsiveCard from "../common/ResponsiveCard";
import {
  Play,
  Target,
  Dumbbell,
  Activity,
  TrendingUp,
  Heart,
} from "lucide-react";

// Lista de videos con formato /preview y parámetro de bucle
const videoLinks = [
  "https://drive.google.com/file/d/14m9mUGZ-fguDoejuIG1-xfkofhG4GbFf/preview?loop=1",
  "https://drive.google.com/file/d/14wyfkDc-ZgoNjSt3ZQ2eaCafNqeHbxXG/preview?loop=1",
  "https://drive.google.com/file/d/1Bx33YyiIUlKF751IXiUoX7Zndz7w-KeN/preview?loop=1",
  "https://drive.google.com/file/d/1TBHxyM3wMEwUCRHBY6fCj876iQXzJ1Gc/preview?loop=1",
  "https://drive.google.com/file/d/1cH2SStVAZ0eEzj1IEJXf9oVXif7Y_XVF/preview?loop=1",
  "https://drive.google.com/file/d/1iHPAXR9LX1r8C4MHfm5OXdYy1QGBW1ym/preview?loop=1",
  "https://drive.google.com/file/d/1lqz5LZbgxrRnG2X5n-H_hLfbnuhpdWNC/preview?loop=1",
  "https://drive.google.com/file/d/1v7k0X3H215uXqGIzZbgMSKDZmnBv5wK7/preview?loop=1",
  "https://drive.google.com/file/d/1xEOdaBF_Go0gpxO_VOHbzEgiX0oZuPqG/preview?loop=1",
];

interface Exercise {
  name: string;
  url: string;
  description?: string;
  difficulty?: string;
  duration?: string;
  benefits?: string[];
}

interface RoutineProps {
  routine: number;
  exercise: Exercise;
  onClick: (routine: number) => void;
}

const Routine: React.FC<RoutineProps> = ({ routine, exercise, onClick }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Principiante":
        return "from-green-500 to-emerald-500";
      case "Intermedio":
        return "from-yellow-500 to-orange-500";
      case "Avanzado":
        return "from-red-500 to-pink-500";
      default:
        return "from-blue-500 to-purple-500";
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onClick(routine)}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition-colors duration-300 font-poppins-semibold">
              Rutina {routine}
            </h3>
            <div
              className={`px-3 py-1 rounded-full bg-gradient-to-r ${getDifficultyColor(
                exercise?.difficulty || ""
              )} text-white text-xs font-semibold font-poppins-medium`}
            >
              {exercise.difficulty}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm leading-relaxed mb-4 font-poppins-light">
            {exercise.description}
          </p>

          {/* Details Grid */}
          <div className="space-y-3">
            {/* Duration */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium font-poppins-medium">
                  Duración
                </p>
                <p className="text-sm text-white font-semibold font-poppins-semibold">
                  {exercise.duration}
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium font-poppins-medium">
                  Beneficios
                </p>
                <div className="space-y-1">
                  {exercise.benefits?.slice(0, 2).map((benefit, index) => (
                    <p
                      key={index}
                      className="text-sm text-gray-300 leading-relaxed font-poppins-light"
                    >
                      • {benefit}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Play Button */}
          <div className="mt-6 flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Play className="w-5 h-5 text-white ml-0.5" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const KeguelChallenge: React.FC = () => {
  const totalRoutines = 5;
  const [currentVideo, setCurrentVideo] = React.useState<string>("");
  const [currentExercise, setCurrentExercise] = React.useState<Exercise | null>(
    null
  );
  const [showVideo, setShowVideo] = React.useState<boolean>(false);

  const generateRandomExercises = (): Exercise[] => {
    const difficulties = ["Principiante", "Intermedio", "Avanzado"];
    const durations = [
      "5-10 min",
      "10-15 min",
      "15-20 min",
      "20-25 min",
      "25-30 min",
    ];
    const benefits = [
      "Mejora el control muscular",
      "Aumenta la resistencia",
      "Fortalece el suelo pélvico",
      "Mejora la función sexual",
      "Previene la incontinencia",
      "Aumenta la confianza",
      "Mejora la circulación",
      "Reduce el estrés",
    ];

    return Array.from({ length: totalRoutines }, (_, i) => {
      const randomVideo =
        videoLinks[Math.floor(Math.random() * videoLinks.length)];
      const randomDifficulty =
        difficulties[Math.floor(Math.random() * difficulties.length)];
      const randomDuration =
        durations[Math.floor(Math.random() * durations.length)];
      const randomBenefits = benefits
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);

      return {
        name: `Ejercicio de Kegel ${i + 1}`,
        url: randomVideo,
        description: `Rutina ${
          i + 1
        } para fortalecer tus músculos pélvicos y mejorar tu control muscular.`,
        difficulty: randomDifficulty,
        duration: randomDuration,
        benefits: randomBenefits,
      };
    });
  };

  const exercises = React.useMemo(() => generateRandomExercises(), []);

  const handleRoutineClick = (routine: number) => {
    const exercise = exercises[routine - 1];
    setCurrentExercise(exercise);
    setCurrentVideo(exercise.url);
    setShowVideo(true);
  };

  // Función para forzar el bucle si el parámetro no funciona solo
  const handleIframeLoad = (iframe: HTMLIFrameElement) => {
    if (iframe && iframe.contentWindow) {
      const videoElement = iframe.contentWindow.document.querySelector("video");
      if (videoElement) {
        videoElement.loop = true;
        videoElement.addEventListener("ended", () => {
          videoElement.play();
        });
      }
    }
  };

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
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
              <Target className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold gradient-text-extended mb-4 font-poppins">
            Reto de Kegel
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed font-poppins-light">
            Fortalece tus músculos pélvicos con estas rutinas especializadas.
            Mejora tu control, resistencia y confianza con ejercicios
            progresivos.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <ResponsiveCard className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 font-poppins-semibold">
              Fortalecimiento
            </h3>
            <p className="text-gray-300 text-sm font-poppins-light">
              Ejercicios progresivos para fortalecer los músculos pélvicos
            </p>
          </ResponsiveCard>

          <ResponsiveCard className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 font-poppins-semibold">
              Control Mejorado
            </h3>
            <p className="text-gray-300 text-sm font-poppins-light">
              Aumenta tu control muscular y resistencia
            </p>
          </ResponsiveCard>

          <ResponsiveCard className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-red-600 rounded-full flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2 font-poppins-semibold">
              Bienestar
            </h3>
            <p className="text-gray-300 text-sm font-poppins-light">
              Mejora tu salud íntima y confianza personal
            </p>
          </ResponsiveCard>
        </motion.div>

        {/* Exercise Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {Array.from({ length: totalRoutines }, (_, i) => i + 1).map(
            (routine, index) => (
              <motion.div
                key={routine}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
              >
                <Routine
                  routine={routine}
                  exercise={exercises[routine - 1]}
                  onClick={handleRoutineClick}
                />
              </motion.div>
            )
          )}
        </motion.div>

        {/* Video Modal */}
        {showVideo && currentExercise && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowVideo(false)}
          >
            <div
              className="bg-gray-900 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white font-poppins-bold">
                  {currentExercise.name}
                </h2>
                <button
                  onClick={() => setShowVideo(false)}
                  className="text-gray-400 hover:text-white transition-colors duration-200"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Video */}
                <div className="aspect-video bg-gray-800 rounded-xl overflow-hidden">
                  <iframe
                    src={currentVideo}
                    className="w-full h-full"
                    allow="autoplay"
                    allowFullScreen
                    onLoad={(e) =>
                      handleIframeLoad(e.currentTarget as HTMLIFrameElement)
                    }
                  />
                </div>

                {/* Exercise Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Activity className="w-5 h-5 text-blue-400" />
                      <div>
                        <p className="text-sm text-gray-400 font-poppins-medium">
                          Duración
                        </p>
                        <p className="text-white font-semibold font-poppins-semibold">
                          {currentExercise.duration}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Target className="w-5 h-5 text-purple-400" />
                      <div>
                        <p className="text-sm text-gray-400 font-poppins-medium">
                          Dificultad
                        </p>
                        <p className="text-white font-semibold font-poppins-semibold">
                          {currentExercise.difficulty}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Heart className="w-5 h-5 text-green-400 mt-1" />
                      <div>
                        <p className="text-sm text-gray-400 font-poppins-medium">
                          Beneficios
                        </p>
                        <div className="space-y-1">
                          {currentExercise.benefits?.map((benefit, index) => (
                            <p
                              key={index}
                              className="text-white text-sm leading-relaxed font-poppins-light"
                            >
                              • {benefit}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center"
        >
          <ResponsiveCard className="max-w-2xl mx-auto">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold gradient-text mb-4 font-poppins-bold">
                ¡Comienza tu Transformación Hoy!
              </h3>
              <p className="text-gray-300 leading-relaxed font-poppins-light">
                Sigue estas rutinas de manera consistente y verás resultados
                increíbles. El fortalecimiento de los músculos pélvicos mejora
                significativamente tu calidad de vida.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 font-poppins-semibold">
                  Ver Más Rutinas
                </button>
                <button className="bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-600 transform hover:scale-105 transition-all duration-200 font-poppins-semibold">
                  Consejos de Expertos
                </button>
              </div>
            </div>
          </ResponsiveCard>
        </motion.div>
      </div>
    </div>
  );
};

export default KeguelChallenge;
