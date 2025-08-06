import React from "react";
import { motion } from "framer-motion";
import { Play, Clock, Target, AlertTriangle, Lightbulb, Dumbbell } from "lucide-react";

interface Exercise {
  name: string;
  url: string;
  description?: string;
  embedUrl?: string;
  duration?: string;
  level?: string;
  precautions?: string;
  tip?: string;
}

interface ExerciseCardProps {
  exercise: Exercise;
  onClick: (exercise: Exercise) => void;
}

const engrosamientoExercises: Exercise[] = [
  {
    name: "Dry Jelq",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/dry-jelq.webm?view=1",
    description: "Ejercicio básico de jelqing seco para engrosamiento. Consiste en masajear el pene sin lubricante para aumentar el grosor.",
    duration: "10-15 minutos por sesión",
    level: "Principiante",
    precautions: "No apliques demasiada fuerza para evitar irritación o lesiones; usa una erección parcial (50-70%)",
    tip: "Hazlo después de un calentamiento con una toalla tibia para mejores resultados"
  },
  {
    name: "Jelq Squeeze",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/jelq-squeeze.webm?view=1",
    description: "Jelqing avanzado con técnica de squeeze para maximizar el grosor. Combina el jelq tradicional con presión extra.",
    duration: "8-12 minutos",
    level: "Intermedio",
    precautions: "Evita apretar demasiado fuerte; si sientes dolor, para de inmediato. Usa lubricante para reducir fricción",
    tip: "Mantén un ritmo constante y no te apresures"
  },
  {
    name: "ULI Basic",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/uli3.webm?view=1",
    description: "Ejercicio ULI básico para engrosamiento. Se enfoca en atrapar la sangre en el pene con una presión controlada.",
    duration: "3-5 repeticiones de 20-30 segundos",
    level: "Intermedio",
    precautions: "No lo hagas con erección completa (80% máx.) para evitar dañar los vasos sanguíneos",
    tip: "Relaja el agarre lentamente para no cortar la circulación de golpe"
  },
  {
    name: "Extreme ULI",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/extreme-uli.webm?view=1",
    description: "Versión avanzada del ULI para resultados intensos. Aumenta la presión y el tiempo para un engrosamiento extremo.",
    duration: "3-4 repeticiones de 30-40 segundos",
    level: "Avanzado",
    precautions: "Solo para experimentados; riesgo alto de lesiones si no controlas la presión. Para si hay molestias",
    tip: "Combínalo con calentamiento y estiramientos previos"
  },
  {
    name: "Plumped Bend",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/plumped-bend.webm?view=1",
    description: "Ejercicio de flexión con el pene semierecto para engrosar. Trabaja la expansión lateral.",
    duration: "5-10 minutos",
    level: "Intermedio",
    precautions: "No dobles con fuerza excesiva ni uses erección completa; puede causar dolor o hematomas",
    tip: "Hazlo con suavidad al principio para adaptarte"
  },
  {
    name: "Sadsak Slinky",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/sadsak-slinky.webm?view=1",
    description: "Técnica avanzada para grosor, basada en movimientos rítmicos y presión. Ideal para usuarios experimentados.",
    duration: "10-12 minutos",
    level: "Avanzado",
    precautions: "Requiere buena técnica; evita si eres principiante o sientes incomodidad",
    tip: "Usa lubricante y empieza con poca intensidad para dominarlo"
  },
];

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onClick }) => {
  const getLevelColor = (level: string) => {
    switch (level) {
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
      onClick={() => onClick(exercise)}
      className="group cursor-pointer"
    >
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300 shadow-xl hover:shadow-2xl">
        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Header */}
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
              {exercise.name}
            </h3>
            <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getLevelColor(exercise.level)} text-white text-xs font-semibold`}>
              {exercise.level}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            {exercise.description}
          </p>

          {/* Details Grid */}
          <div className="space-y-3">
            {/* Duration */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Duración</p>
                <p className="text-sm text-white font-semibold">{exercise.duration}</p>
              </div>
            </div>

            {/* Precautions */}
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-pink-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <AlertTriangle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Precauciones</p>
                <p className="text-sm text-gray-300 leading-relaxed">{exercise.precautions}</p>
              </div>
            </div>

            {/* Tip */}
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                <Lightbulb className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium">Consejo</p>
                <p className="text-sm text-gray-300 leading-relaxed">{exercise.tip}</p>
              </div>
            </div>
          </div>

          {/* Play Button */}
          <div className="mt-6 flex justify-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Play className="w-5 h-5 text-white ml-0.5" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Engrosamiento: React.FC = () => {
  const [currentVideo, setCurrentVideo] = React.useState<string>("");
  const [currentExercise, setCurrentExercise] = React.useState<Exercise | null>(null);
  const [showVideo, setShowVideo] = React.useState<boolean>(false);

  const handleExerciseClick = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setCurrentVideo(exercise.embedUrl || exercise.url);
    setShowVideo(true);
  };

  return (
    <div className="space-y-8">
      {/* Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {engrosamientoExercises.map((exercise, index) => (
          <motion.div
            key={exercise.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ExerciseCard
              exercise={exercise}
              onClick={handleExerciseClick}
            />
          </motion.div>
        ))}
      </div>

      {/* Video Modal */}
      {showVideo && currentExercise && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setShowVideo(false)}
        >
          <div className="bg-gray-900 rounded-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">{currentExercise.name}</h2>
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
                {currentExercise.embedUrl ? (
                  <iframe
                    src={currentExercise.embedUrl}
                    frameBorder={0}
                    marginWidth={0}
                    marginHeight={0}
                    scrolling="no"
                    width="100%"
                    height="100%"
                    allowFullScreen
                    className="w-full h-full"
                  />
                ) : (
                  <video
                    controls
                    src={currentVideo}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Exercise Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-blue-400" />
                    <div>
                      <p className="text-sm text-gray-400">Duración</p>
                      <p className="text-white font-semibold">{currentExercise.duration}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Target className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-sm text-gray-400">Nivel</p>
                      <p className="text-white font-semibold">{currentExercise.level}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="w-5 h-5 text-red-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Precauciones</p>
                      <p className="text-white text-sm leading-relaxed">{currentExercise.precautions}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Lightbulb className="w-5 h-5 text-yellow-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-400">Consejo</p>
                      <p className="text-white text-sm leading-relaxed">{currentExercise.tip}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Engrosamiento;