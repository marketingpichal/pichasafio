import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Exercise {
  name: string;
  url: string;
  description?: string;
}

interface DayProps {
  day: number;
  exercise: Exercise;
  onClick: (day: number) => void;
}

const exercises: Exercise[] = [
  {
    name: "Breathing Exercise 1",
    url: "",
    description: "Description for breathing exercise 1",
  },
  {
    name: "Breathing Exercise 2",
    url: "",
    description: "Description for breathing exercise 2",
  },
  // Add more exercises as needed
];

const Day: React.FC<DayProps> = ({ day, exercise, onClick }) => {
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

const KeguelChallengue: React.FC = () => {
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
    setCurrentVideo(exercise.url);
    setShowVideo(true);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <Card className="max-w-4xl mx-auto bg-gray-800">
        <CardContent className="p-6">
          <h1 className="text-3xl font-bold mb-8 text-center text-white">
            Calendario de Keguel (PROXIMAMENTE)
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
                <video
                  controls
                  src={currentVideo}
                  className="max-w-[80%] h-auto"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default KeguelChallengue;