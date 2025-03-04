import React from "react";
import { Card, CardContent } from "@/components/ui/card";

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
}

interface RoutineProps {
  routine: number;
  exercise: Exercise;
  onClick: (routine: number) => void;
}

const Routine: React.FC<RoutineProps> = ({ routine, exercise, onClick }) => {
  return (
    <div
      onClick={() => onClick(routine)}
      className="p-4 border-2 border-blue-500 bg-blue-600 cursor-pointer 
                transition-all duration-300 rounded hover:bg-blue-700 text-white"
    >
      <div className="font-bold mb-1">Rutina {routine}</div>
      <div className="text-sm">{exercise.name}</div>
    </div>
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
    return Array.from({ length: totalRoutines }, (_, i) => {
      const randomVideo = videoLinks[Math.floor(Math.random() * videoLinks.length)];
      return {
        name: `Ejercicio de Kegel ${i + 1}`,
        url: randomVideo,
        description: `Rutina ${i + 1} para fortalecer tus músculos pélvicos`,
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
        videoElement.loop = true; // Intentar establecer loop directamente
        videoElement.addEventListener("ended", () => {
          videoElement.play(); // Reiniciar manualmente al finalizar
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Card className="max-w-4xl mx-auto bg-gray-800">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-8 text-center text-white">
            Rutinas de Kegel
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {Array.from({ length: totalRoutines }, (_, i) => i + 1).map((routine) => (
              <Routine
                key={routine}
                routine={routine}
                exercise={exercises[routine - 1]}
                onClick={handleRoutineClick}
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
              <div className="flex justify-center items-center h-[70vh] w-full">
                <iframe
                  src={currentVideo}
                  className="w-full h-full max-w-[90%] max-h-[90%] rounded-lg"
                  allow="autoplay"
                  allowFullScreen
                  onLoad={(e) => handleIframeLoad(e.currentTarget as HTMLIFrameElement)}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KeguelChallenge;