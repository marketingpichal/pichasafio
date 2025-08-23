import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { challengeService, type Achievement } from "@/lib/challengeService";
import ResponsiveCard from "../common/ResponsiveCard";
import { Trophy, Star, Target, Award } from "lucide-react";
import { motion } from "framer-motion";

const Achievements: React.FC = () => {
  const { user } = useAuth();
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    const loadAchievements = async () => {
      setIsLoading(true);
      try {
        const userAchievements = await challengeService.getUserAchievements(user.id);
        setAchievements(userAchievements);
      } catch (error) {
        console.error("Error loading achievements:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAchievements();
  }, [user?.id]);

  if (isLoading) {
    return (
      <ResponsiveCard>
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-pink-500"></div>
          <p className="text-gray-300">Cargando logros...</p>
        </div>
      </ResponsiveCard>
    );
  }

  return (
    <ResponsiveCard
      title="Mis Logros"
      subtitle={`Has ganado ${achievements.length} logros`}
    >
      {achievements.length === 0 ? (
        <div className="text-center py-8">
          <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-2">Aún no tienes logros</p>
          <p className="text-gray-500 text-sm">
            Completa ejercicios y mantén rachas para ganar logros
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl p-4"
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <h3 className="font-semibold text-white">{achievement.name}</h3>
                  <p className="text-yellow-400 text-sm">+{achievement.points_reward} XP</p>
                </div>
              </div>
              <p className="text-gray-300 text-sm">{achievement.description}</p>
            </motion.div>
          ))}
        </div>
      )}
    </ResponsiveCard>
  );
};

export default Achievements;
