import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Exercise {
  name: string;
  url: string;
  description?: string;
  embedUrl?: string;
}

interface DayProps {
  day: number;
  exercise: Exercise;
  onClick: (day: number) => void;
}

const exercises: Exercise[] = [
  {
    name: "Dry Jelq",
    url: "https://ghbrisk.com/z2f2g5rix02n?view=1",
    embedUrl: "https://ghbrisk.com/e/z2f2g5rix02n",
    description: "Ejercicio básico de jelqing seco",
  },
  {
    name: "Jelq Squeeze",
    url: "https://ghbrisk.com/sgt0gmzij6q0",
    description: "Jelqing con técnica de squeeze",
  },
  {
    name: "ULI Basic",
    url: "https://ghbrisk.com/s6xpur8wu859",
    description: "Ejercicio ULI básico",
  },
  {
    name: "Extreme ULI",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/extreme-uli.webm?view=1",
    description: "Versión avanzada del ULI",
  },
  {
    name: "Plumped Bend",
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/plumped-bend.webm?view=1",
    description: "Ejercicio de flexión",
  },
  {
    name: "Sadsak Slinky",
    url: "https://ghbrisk.com/z2f2g5rix02nƒ",
    description: "Técnica Sadsak Slinky",
  },
  {
    name: "Manual Stretches",
    url: "https://ghbrisk.com/hf2c4b7otlub",
    description: "Estiramientos manuales básicos",
  },
  {
    name: "BTC Stretch",
    url: "https://ghbrisk.com/e/intq78mtlfxr?view=1",
    embedUrl: "https://ghbrisk.com/e/intq78mtlfxr", // Nuevo iframe que me pasaste
    description: "Estiramiento BTC",
  },
  {
    name: "JAI Stretch",
    url: "https://ghbrisk.com/dylqbnzx7aqd",
    description: "Estiramiento JAI",
  },
  {
    name: "V-Stretch",
    url: "https://ghbrisk.com/intq78mtlfxr",
    description: "Estiramiento en V",
  },
  {
    name: "Inverted V-Stretch",
    url: "https://ghbrisk.com/val0i7vpzxwn",
    description: "Estiramiento en V invertida",
  },
];

const Day: React.FC<DayProps> = ({ day, exercise, onClick }) => {
   console.log('day', day);
  return (
    <div
      onClick={() => onClick(day)}
      className="p-4 border-2 border-blue-500 bg-blue-600 cursor-pointer 
                transition-all duration-300 rounded hover:bg-blue-700 text-white"
    >
      <div className="font-bold mb-1">Día {day}</div>
      <div className="text-sm">{exercise.name}</div>
    </div>
  );
};

const ThirtyDayChallenge: React.FC = () => {
  const totalDays = 30;
  const [currentVideo, setCurrentVideo] = React.useState<string>("");
  const [currentExercise, setCurrentExercise] = React.useState<Exercise | null>(
    null
  );
  const [showVideo, setShowVideo] = React.useState<boolean>(false);

  const getExerciseForDay = (day: number): Exercise => {
    const exerciseIndex = (day - 1) % exercises.length;
    return exercises[exerciseIndex];
  };

  const handleDayClick = (day: number) => {
    const exercise = getExerciseForDay(day);
    setCurrentExercise(exercise);
    setCurrentVideo(exercise.embedUrl || exercise.url); // Usamos embedUrl si existe
    setShowVideo(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Card className="max-w-4xl mx-auto bg-gray-800">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-8 text-center text-white">
            Desafío de 30 Días
          </h1>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
            {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
              <Day
                key={day}
                day={day}
                exercise={getExerciseForDay(day)}
                onClick={handleDayClick}
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

export default ThirtyDayChallenge;
