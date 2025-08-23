import Header from "./components/header";
import { Testimonial } from "./components/testimmonials";
import BannerElTiempo from "./assets/banner-el-tiempo.jpg";
import { Publicity } from "./components/Publicity";
import ThirtyDayChallenge from "./components/ThirtyDaysChanllenge";
import Instructions from "./components/Instrucciones";
import Footer from "./components/Footer";
import InstruccionesPene from "./components/Warning";
import PoseList from "./components/Poses/poseList";
import { useState } from "react";
import { useAuth } from "./context/AuthProvider";

export default function Page() {
  const [showPoses, setShowPoses] = useState(false);
  const { user } = useAuth();
  const isAuthenticated = !!user;

  if (showPoses) {
    return <PoseList onBack={() => setShowPoses(false)} />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative">
        <Header />


      </section>
  

      {/* Warning Section */}
      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <InstruccionesPene />
        </div>
      </section>

      {/* Poses Explorer Button Section - Solo para usuarios autenticados */}
      {isAuthenticated && (
        <section className="py-8 sm:py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-2xl p-8 text-center">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  Explorador de Poses Íntimas
                </h2>
                <p className="text-pink-100 text-lg mb-8">
                  Descubre nuevas formas de conectar con tu pareja. Explora poses con instrucciones detalladas, 
                  consejos de seguridad y beneficios para una experiencia placentera y segura.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button
                    onClick={() => setShowPoses(true)}
                    className="bg-white text-purple-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-3"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Explorar Poses
                  </button>
                  <div className="flex items-center gap-2 text-pink-100 text-sm">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <span>Contenido educativo y seguro</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Publicity Section */}
      <section className="py-8 sm:py-12 bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Publicity />
        </div>
      </section>

      {/* Instructions Section */}
      <section className="py-8 sm:py-12 bg-gray-800/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Instructions />
        </div>
      </section>

      {/* Hero Content Section - Testimonial & Donation Banner */}
      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gray-800/50 rounded-2xl p-6 sm:p-8">
            <Testimonial />
          </div>
        </div>
      </section>

      {/* Thirty Day Challenge Section - Solo para usuarios autenticados */}
      {isAuthenticated && (
        <section className="py-8 sm:py-12 bg-gray-800/50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <ThirtyDayChallenge />
          </div>
        </section>
      )}

      {/* Banner Section */}
      <section className="py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <img
              src={BannerElTiempo}
              alt="Banner El Tiempo"
              className="w-full h-auto rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              style={{ maxHeight: "1000px", objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      {/* Footer Section */}
      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Footer />
        </div>
      </section>
    </div>
  );
}
