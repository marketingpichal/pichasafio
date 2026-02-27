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
        return "bg-green-500/20 text-green-400 border border-green-500/50";
      case "Intermedio":
        return "bg-amber-500/20 text-amber-400 border border-amber-500/50";
      case "Avanzado":
        return "bg-red-500/20 text-red-400 border border-red-500/50";
      default:
        return "bg-stone-800 text-gray-300 border border-stone-700";
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={() => onClick(routine)}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden bg-stone-900 rounded-2xl p-6 border border-stone-800 hover:border-red-500/50 transition-all duration-300 shadow-lg">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors duration-300 font-poppins-semibold uppercase tracking-wider">
              Rutina {routine}
            </h3>
            <div
              className={`px-3 py-1 rounded-full ${getDifficultyColor(
                exercise?.difficulty || ""
              )} text-xs font-semibold font-poppins-medium tracking-wide`}
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
              <div className="w-8 h-8 bg-stone-800 border border-stone-700 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium font-poppins-medium uppercase tracking-wider">
                  Duración
                </p>
                <p className="text-sm text-white font-semibold font-poppins-semibold">
                  {exercise.duration}
                </p>
              </div>
            </div>

            {/* Benefits */}
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-stone-800 border border-stone-700 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Heart className="w-4 h-4 text-red-500" />
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
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg shadow-red-900/40">
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
        description: `Rutina ${i + 1
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
            <div className="w-20 h-20 bg-stone-900 border border-red-500/30 rounded-full flex items-center justify-center shadow-lg shadow-red-900/20">
              <Target className="w-10 h-10 text-red-500" />
            </div>
          </div>
          <h1 className="challenge-heading text-4xl sm:text-5xl md:text-6xl mb-4 text-white drop-shadow-md">
            RETO DE KEGEL
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed font-poppins-medium">
            El control muscular es la base de todo. Falla aquí y fallarás en el resto. No es magia, es entrenamiento puro.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <ResponsiveCard className="text-center bg-stone-900 border-stone-800">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-stone-800 border border-stone-700 rounded-full flex items-center justify-center">
                <Dumbbell className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-poppins-semibold uppercase tracking-wider">
              Resistencia
            </h3>
            <p className="text-gray-400 text-sm font-poppins-medium">
              Soporta más carga, controla el impulso.
            </p>
          </ResponsiveCard>

          <ResponsiveCard className="text-center bg-stone-900 border-stone-800">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-stone-800 border border-stone-700 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            <h3 className="text-lg font-bold text-amber-500 mb-2 font-poppins-semibold uppercase tracking-wider">
              Ejecución
            </h3>
            <p className="text-gray-400 text-sm font-poppins-medium">
              Mejora tu control exactamente en el momento crítico.
            </p>
          </ResponsiveCard>

          <ResponsiveCard className="text-center bg-stone-900 border-stone-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-red-600/5 z-0"></div>
            <div className="relative z-10">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-stone-800 border border-red-500/30 rounded-full flex items-center justify-center">
                  <Heart className="w-5 h-5 text-red-500" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2 font-poppins-semibold uppercase tracking-wider">
                Recuperación
              </h3>
              <p className="text-gray-400 text-sm font-poppins-medium">
                Optimiza la circulación y preparate para el siguiente round.
              </p>
            </div>
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
                      <Target className="w-5 h-5 text-red-400" />
                      <div>
                        <p className="text-sm text-gray-400 font-poppins-medium uppercase tracking-wider">
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
          className="text-center mt-6"
        >
          <div className="bg-stone-900 border border-stone-800 p-8 sm:p-10 max-w-2xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-red-600"></div>
            <div className="space-y-4">
              <h3 className="text-2xl sm:text-3xl font-poppins-extrabold uppercase tracking-tighter text-white mb-2">
                DÉJATE DE EXCUSAS
              </h3>
              <p className="text-gray-400 leading-relaxed font-poppins-medium">
                Si no dominas lo básico, el resto del desafío no sirve de nada.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-red-600 text-white px-8 py-4 font-poppins-bold uppercase tracking-widest text-sm hover:bg-red-700 transition-colors shadow-lg shadow-red-900/50"
                >
                  ARRANCAR RUTINA
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default KeguelChallenge;
