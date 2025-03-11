import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Exercise {
  name: string;
  url: string;
  description?: string;
  embedUrl?: string;
}

interface ExerciseCardProps {
  exercise: Exercise;
  onClick: (exercise: Exercise) => void;
}

const engrosamientoExercises: Exercise[] = [
  {
    name: "Dry Jelq",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/dry-jelq.webm?view=1",
    description: "Ejercicio básico de jelqing seco para engrosamiento. Consiste en masajear el pene sin lubricante para aumentar el grosor. **Duración:** 10-15 minutos por sesión. **Nivel:** Principiante. **Precauciones:** No apliques demasiada fuerza para evitar irritación o lesiones; usa una erección parcial (50-70%). **Consejo:** Hazlo después de un calentamiento con una toalla tibia para mejores resultados.",
  },
  {
    name: "Jelq Squeeze",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/jelq-squeeze.webm?view=1",
    description: "Jelqing avanzado con técnica de squeeze para maximizar el grosor. Combina el jelq tradicional con presión extra. **Duración:** 8-12 minutos. **Nivel:** Intermedio. **Precauciones:** Evita apretar demasiado fuerte; si sientes dolor, para de inmediato. Usa lubricante para reducir fricción. **Consejo:** Mantén un ritmo constante y no te apresures.",
  },
  {
    name: "ULI Basic",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/uli3.webm?view=1",
    description: "Ejercicio ULI básico para engrosamiento. Se enfoca en atrapar la sangre en el pene con una presión controlada. **Duración:** 3-5 repeticiones de 20-30 segundos cada una. **Nivel:** Intermedio. **Precauciones:** No lo hagas con erección completa (80% máx.) para evitar dañar los vasos sanguíneos. **Consejo:** Relaja el agarre lentamente para no cortar la circulación de golpe.",
  },
  {
    name: "Extreme ULI",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/extreme-uli.webm?view=1",
    description: "Versión avanzada del ULI para resultados intensos. Aumenta la presión y el tiempo para un engrosamiento extremo. **Duración:** 3-4 repeticiones de 30-40 segundos. **Nivel:** Avanzado. **Precauciones:** Solo para experimentados; riesgo alto de lesiones si no controlas la presión. Para si hay molestias. **Consejo:** Combínalo con calentamiento y estiramientos previos.",
  },
  {
    name: "Plumped Bend",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/plumped-bend.webm?view=1",
    description: "Ejercicio de flexión con el pene semierecto para engrosar. Trabaja la expansión lateral. **Duración:** 5-10 minutos. **Nivel:** Intermedio. **Precauciones:** No dobles con fuerza excesiva ni uses erección completa; puede causar dolor o hematomas. **Consejo:** Hazlo con suavidad al principio para adaptarte.",
  },
  {
    name: "Sadsak Slinky",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/sadsak-slinky.webm?view=1",
    description: "Técnica avanzada para grosor, basada en movimientos rítmicos y presión. Ideal para usuarios experimentados. **Duración:** 10-12 minutos. **Nivel:** Avanzado. **Precauciones:** Requiere buena técnica; evita si eres principiante o sientes incomodidad. **Consejo:** Usa lubricante y empieza con poca intensidad para dominarlo.",
  },
];

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onClick }) => {
  return (
    <div
      onClick={() => onClick(exercise)}
      className="p-4 border-2 border-purple-500 bg-purple-600 cursor-pointer 
                transition-all duration-300 rounded hover:bg-purple-700 text-white"
    >
      <div className="font-bold mb-1">{exercise.name}</div>
      <div className="text-sm">{exercise.description}</div>
    </div>
  );
};

const Engrosamiento: React.FC = () => {
  const [currentVideo, setCurrentVideo] = React.useState<string>("");
  const [currentExercise, setCurrentExercise] = React.useState<Exercise | null>(
    null
  );
  const [showVideo, setShowVideo] = React.useState<boolean>(false);

  const handleExerciseClick = (exercise: Exercise) => {
    setCurrentExercise(exercise);
    setCurrentVideo(exercise.embedUrl || exercise.url);
    setShowVideo(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Card className="max-w-4xl mx-auto bg-gray-800">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-8 text-center text-white">
            Rutina de Engrosamiento
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {engrosamientoExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.name}
                exercise={exercise}
                onClick={handleExerciseClick}
              />
            ))}
          </div>

          {showVideo && currentExercise && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-xl font-bold">{currentExercise.name}</h2>
                {currentExercise.description && (
                  <p className="text-gray-300 mt-2">
                    {currentExercise.description}
                  </p>
                )}
              </div>
              <div className="flex justify-center items-center h-[50vh]">
                {currentExercise.embedUrl ? (
                  <iframe
                    src={currentExercise.embedUrl}
                    frameBorder={0}
                    marginWidth={0}
                    marginHeight={0}
                    scrolling="no"
                    width={640}
                    height={860}
                    allowFullScreen
                    className="max-w-[80%] h-[350px]"
                  />
                ) : (
                  <video
                    controls
                    src={currentVideo}
                    className="max-w-[80%] h-[400px]"
                  />
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Engrosamiento;