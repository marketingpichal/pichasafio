import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface VideoLink {
  url: string;
}

interface DayProps {
  day: number;
  isUnlocked: boolean;
  onClick: (day: number) => void;
}

const videoLinks: VideoLink[] = [
  {
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/dry-jelq.webm?view=1",
  },
  {
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/dry-jelq.webm?view=1",
  },
  {
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/jelq-squeeze.webm?view=1",
  },
  {
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/jelq-squeeze.webm?view=1",
  },
  {
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/uli3.webm?view=1",
  },
  {
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/extreme-uli.webm?view=1",
  },
  {
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/plumped-bend.webm?view=1",
  },
  {
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/sadsak-slinky.webm?view=1",
  },
  {
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/simple-manual-stretches.webm?view=1",
  },
  {
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/btc-stretch.webm?view=1",
  },
  {
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/jai-stretch.webm?view=1",
  },
  {
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/v-stretch.webm?view=1",
  },
  {
    url: "https://free-penis-enlargement-videos.thundersplace.org/videos/webm/inverted-v-a-stretch.webm?view=1",
  },
];

const Day: React.FC<DayProps> = ({ day, isUnlocked, onClick }) => {
  return (
    <div
      onClick={() => onClick(day)}
      className={`p-5 border-2 cursor-pointer transition-all duration-300 rounded bg-gray-800 text-white
        ${
          isUnlocked
            ? "border-blue-500 bg-blue-600 opacity-100"
            : "border-gray-600 opacity-50"
        }`}
    >
      Día {day}
    </div>
  );
};

const ThirtyDayChallenge: React.FC = () => {
  const totalDays = 30;
  const [unlockedDays, setUnlockedDays] = useState<number[]>([]);
  const [currentVideo, setCurrentVideo] = useState<string>("");
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    // Load progress from localStorage
    const savedProgress = localStorage.getItem("unlockedDays");
    if (savedProgress) {
      setUnlockedDays(JSON.parse(savedProgress));
    } else {
      // For testing, unlock all days
      const allDays = Array.from({ length: totalDays }, (_, i) => i + 1);
      setUnlockedDays(allDays);
      localStorage.setItem("unlockedDays", JSON.stringify(allDays));
    }
  }, []);

  const unlockDay = (day: number) => {
    if (!unlockedDays.includes(day)) {
      const newUnlockedDays = [...unlockedDays, day];
      setUnlockedDays(newUnlockedDays);
      localStorage.setItem("unlockedDays", JSON.stringify(newUnlockedDays));
    }
  };

  const handleDayClick = (day: number) => {
    if (unlockedDays.includes(day)) {
      const videoIndex = (day - 1) % videoLinks.length;
      if (videoIndex % 7 !== 6) {
        // Rest days every 7 days
        setCurrentVideo(videoLinks[videoIndex].url);
        setShowVideo(true);
      }

      // Unlock next day if clicking today's challenge
      const today = new Date().getDate();
      if (day === today) {
        unlockDay(day + 1);
      }
    }
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
                isUnlocked={unlockedDays.includes(day)}
                onClick={handleDayClick}
              />
            ))}
          </div>

          {showVideo && (
            <div className="flex justify-center items-center h-[50vh]">
              <video
                controls
                src={currentVideo}
                className="max-w-[80%] h-auto"
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ThirtyDayChallenge;
