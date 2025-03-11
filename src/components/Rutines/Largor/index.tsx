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

const alargamientoExercises: Exercise[] = [
  {
    name: "Manual Stretches",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/simple-manual-stretches.webm?view=1",
    description: "Estiramientos manuales básicos para alargar el pene. Se hacen con las manos en diferentes direcciones para estirar los tejidos. **Duración:** 10-15 minutos (2-3 minutos por dirección). **Nivel:** Principiante. **Precauciones:** No tires demasiado fuerte; evita dolor o molestias. **Consejo:** Calienta antes con una toalla tibia para que los tejidos estén más flexibles.",
  },
  {
    name: "BTC Stretch",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/btc-stretch.webm?view=1",
    description: "Estiramiento BTC (Between The Cheeks) para longitud. Se estira el pene hacia atrás, entre las piernas. **Duración:** 5-10 minutos (mantén 20-30 segundos por repetición). **Nivel:** Intermedio. **Precauciones:** No lo hagas con erección; usa fuerza moderada para evitar tensión excesiva. **Consejo:** Siéntate sobre el pene después de estirar para mantener la elongación.",
  },
  {
    name: "JAI Stretch",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/jai-stretch.webm?view=1",
    description: "Estiramiento JAI para mayor alcance. Movimientos rápidos y controlados que trabajan la longitud. **Duración:** 8-12 minutos (20-30 repeticiones de 2-3 segundos). **Nivel:** Principiante/Intermedio. **Precauciones:** Mantén un ritmo suave; evita movimientos bruscos que puedan causar molestias. **Consejo:** Combínalo con estiramientos básicos para mejores resultados.",
  },
  {
    name: "V-Stretch",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/v-stretch.webm?view=1",
    description: "Estiramiento en V para alargar. Usa un punto de apoyo (como el pulgar) para aumentar la tensión en el pene. **Duración:** 5-10 minutos (20-30 segundos por repetición). **Nivel:** Intermedio. **Precauciones:** No apliques presión excesiva en el punto de apoyo; hazlo con cuidado para no lesionarte. **Consejo:** Usa la otra mano para estabilizar y controlar mejor.",
  },
  {
    name: "Inverted V-Stretch",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/inverted-v-a-stretch.webm?view=1",
    description: "Estiramiento en V invertida para longitud avanzada. Variación que trabaja los tejidos desde otro ángulo. **Duración:** 5-8 minutos (20-30 segundos por repetición). **Nivel:** Avanzado. **Precauciones:** Solo para usuarios con experiencia; detente si sientes dolor o fatiga. **Consejo:** Hazlo después de un calentamiento largo y combínalo con otros estiramientos.",
  },
];

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onClick }) => {
  return (
    <div
      onClick={() => onClick(exercise)}
      className="p-3 border-2 border-blue-500 bg-blue-600 cursor-pointer 
                transition-all duration-300 rounded hover:bg-blue-700 text-white"
    >
      <div className="font-bold text-sm mb-1">{exercise.name}</div>
      <div className="text-xs">{exercise.description}</div>
    </div>
  );
};

const Alargamiento: React.FC = () => {
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
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <Card className="max-w-4xl mx-auto bg-gray-800">
        <CardContent className="p-4">
          <h1 className="text-2xl font-bold mb-4 text-center text-white">
            Rutina de Alargamiento
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
            {alargamientoExercises.map((exercise) => (
              <ExerciseCard
                key={exercise.name}
                exercise={exercise}
                onClick={handleExerciseClick}
              />
            ))}
          </div>

          {showVideo && currentExercise && (
            <div className="space-y-2">
              <div className="text-center">
                <h2 className="text-lg font-bold">{currentExercise.name}</h2>
                {currentExercise.description && (
                  <p className="text-gray-300 text-sm mt-1">
                    {currentExercise.description}
                  </p>
                )}
              </div>
              <div className="flex justify-center items-center h-[30vh]">
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
                    className="max-w-[80%] h-[200px]"
                  />
                ) : (
                  <video
                    controls
                    src={currentVideo}
                    className="max-w-[80%] h-[200px]"
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

export default Alargamiento;