// import Header from "./components/header";
import PoseScroll from "./components/PoseScroll";
import Footer from "./components/Footer";
import PoseList from "./components/Poses/poseList";
import LeaderboardTable from "./components/LeaderboardTable";
import QuickStats from "./components/QuickStats";
import AchievementNotification from "./components/AchievementNotification";
import { useState } from "react";
import { useAuth } from "./context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function Page() {
  const [showPoses, setShowPoses] = useState(false);
  const { user } = useAuth();
  const isAuthenticated = !!user;
  const navigate = useNavigate();

  if (showPoses) {
    return <PoseList onBack={() => setShowPoses(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Notificaciones de Logros - Solo para usuarios autenticados */}
      {isAuthenticated && <AchievementNotification />}

      {/* Hero Section */}
      {/* <section className="relative">
        <Header />
      </section> */}

      {/* Quick Stats Section - Para todos los usuarios */}
      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <QuickStats />
        </div>
      </section>

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

      {/* Call to Action para usuarios no autenticados */}
      {!isAuthenticated && (
        <section className="py-8 sm:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/20 rounded-2xl p-8">
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  ¡Únete a la Competencia!
                </h2>
                <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                  Regístrate para ver el ranking de líderes, ganar puntos,
                  desbloquear logros y competir con otros usuarios.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => navigate("/register")}
                    className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-pink-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
                  >
                    Registrarse
                  </button>
                  <button
                    onClick={() => navigate("/login")}
                    className="bg-gray-700 text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-600 transform hover:scale-105 transition-all duration-200"
                  >
                    Iniciar Sesión
                  </button>
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
