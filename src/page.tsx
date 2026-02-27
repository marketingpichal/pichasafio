// import Header from "./components/header";
import PoseScroll from "./components/PoseScroll";
import Footer from "./components/Footer";
import PoseList from "./components/Poses/poseList";
import LeaderboardTable from "./components/LeaderboardTable";
import AchievementNotification from "./components/AchievementNotification";
import RewardsPanel from "./components/RewardsPanel";
import SpinWheel from "./components/SpinWheel";
import DailyXPButton from "./components/DailyXPButton";
import TelegramBanner from "./components/TelegramBanner";
import { useState } from "react";
import { useAuth } from "./context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Page() {
  const [showPoses, setShowPoses] = useState(false);
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();

  const handleDailyXPClaim = () => {
    setShowSpinWheel(true);
  };

  if (showPoses) {
    return <PoseList onBack={() => setShowPoses(false)} />;
  }

  const handleSpinWheelClose = () => {
    setShowSpinWheel(false);
  };

  const handleRewardClaimed = (xp: number) => {
    // XP claimed from spin wheel
    if (import.meta.env.DEV) {
      console.log(`Usuario ganó ${xp} XP de la ruleta`);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950">
      {/* Botón flotante para reclamar XP diario */}
      {isAuthenticated && (
        <DailyXPButton onClaimClick={handleDailyXPClaim} />
      )}

      {/* Ruleta de Premios - Solo para usuarios autenticados */}
      {isAuthenticated && showSpinWheel && (
        <SpinWheel
          onClose={handleSpinWheelClose}
          onRewardClaimed={handleRewardClaimed}
        />
      )}

      {/* Notificaciones de Logros - Solo para usuarios autenticados */}
      {isAuthenticated && <AchievementNotification />}

      {/* Hero Section */}
      <motion.section
        className="relative pt-20 pb-12 sm:pt-28 sm:pb-16 border-b border-stone-800"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.h1
            className="challenge-heading text-5xl sm:text-7xl mb-6 drop-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            NO ES FÁCIL.<br /> <span className="challenge-accent-text">POR ESO ESTÁS AQUÍ.</span>
          </motion.h1>
          <motion.p
            className="text-gray-400 text-lg sm:text-xl mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Pichasafio no es un blog más de bienestar. Es un campo de pruebas para tu salud íntima. Menos excusas, más resultados.
          </motion.p>
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(isAuthenticated ? "/thirty-days-challenge" : "/register")}
              className="bg-red-600 text-white px-10 py-4 font-poppins-bold uppercase tracking-widest text-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-900/50"
            >
              {isAuthenticated ? "Continuar" : "Aceptar el desafío"}
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Telegram Banner */}
      <TelegramBanner />

      {/* Pose Scroll Section */}
      <section>
        <PoseScroll />
      </section>

      {/* Leaderboard Section - Solo para usuarios autenticados */}
      {isAuthenticated && (
        <section className="py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <LeaderboardTable />
          </div>
        </section>
      )}

      {/* Rewards Section - Solo para usuarios autenticados */}
      {isAuthenticated && (
        <section className="py-12 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <RewardsPanel />
          </div>
        </section>
      )}

      {/* Call to Action para usuarios no autenticados */}
      {!isAuthenticated && (
        <section className="py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="bg-stone-900/80 border border-stone-800 p-8 sm:p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-600"></div>
                <h2 className="text-3xl sm:text-4xl challenge-heading mb-4">
                  EL TIEMPO PASA
                </h2>
                <p className="text-gray-400 mb-8 max-w-xl mx-auto text-lg">
                  Miles de hombres ya están tomando el control. Deja de procrastinar.
                </p>
                <div className="flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate("/register")}
                    className="bg-red-600/10 text-red-500 border border-red-500/50 px-10 py-4 font-poppins-bold uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all duration-200"
                  >
                    Aceptar el desafío
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Footer Section */}
      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Footer />
        </div>
      </section>
    </div>
  );
}
