import { useState, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Page from "./page";
import AgeVerificationModal from "./components/VerificarEdad";
import Navbar from "./components/NavigationBar";
import DonationBanner from "./components/DonationBanner";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import { AuthProvider } from "./context/AuthProvider";
import { AchievementProvider } from "./context/AchievementContext";

// Lazy load heavy components for better performance
const FarmingCalculator = lazy(() => import("./components/FarmingCalculator"));
const KeguelChallengue = lazy(() => import("./components/KeguelChallenge"));
const RespirationCalendar = lazy(() => import("./components/RespirationCalendar"));
const Testimonials = lazy(() => import("./components/TestimoniosAnonimos"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const ResetPassword = lazy(() => import("./components/ResetPassword"));
const CompleteProfile = lazy(() => import("./components/CompleteProfile"));
const Rutinas = lazy(() => import("./components/Rutines"));
const Chochasafio = lazy(() => import("./components/Chochasafio"));
const SexShop = lazy(() => import("./components/Sexshop"));
const TerminosYCondiciones = lazy(() => import("./components/Terms"));
const GuideStore = lazy(() => import("./components/Guides/guideStore"));
const PoseViewer = lazy(() => import("./components/PoseViewer"));
const UserProfile = lazy(() => import("./components/UserProfile"));
const ThirtyDaysChallenge = lazy(() => import("./components/ThirtyDaysChanllenge"));
const ProtectedRoute = lazy(() => import("./components/common/ProtectedRoute"));
const GuidePopup = lazy(() => import("./components/GuidePopup"));

const About = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
        Acerca de Nosotros
      </h2>
      <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
        Pichasafio.com es tu comunidad para mejorar tu salud íntima y bienestar
        personal. Ofrecemos recursos, rutinas y herramientas para ayudarte en tu
        viaje de automejora.
      </p>
    </div>
  </div>
);

export default function App() {
  const [isVerified, setIsVerified] = useState(false);

  const handleVerification = (verified: boolean) => {
    setIsVerified(verified);
    if (!verified) {
      window.location.href = "https://www.google.com";
    }
  };

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AchievementProvider>
        <div className="min-h-screen bg-gray-900">
          {!isVerified && (
            <AgeVerificationModal onVerified={handleVerification} />
          )}
          {isVerified && (
            <div className="flex flex-col min-h-screen">
              <DonationBanner />
              <Navbar />
              <main className="flex-1">
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    <Route path="/" element={<Page />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/calculadora" element={<FarmingCalculator />} />
                    <Route path="/keguel" element={<KeguelChallengue />} />
                    <Route path="/respiracion" element={<RespirationCalendar />} />
                    <Route path="/testimonios" element={<Testimonials />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/complete-profile" element={<CompleteProfile />} />
                    <Route path="/rutinas" element={<Rutinas />} />
                    <Route path="/chochasafio" element={<Chochasafio />} />
                    <Route path="/tyc" element={<TerminosYCondiciones />} />
                    <Route path="/sexshop" element={<SexShop />} />
                    <Route path="/guia" element={<GuideStore />} />
                    <Route
                      path="/pose/:id"
                      element={
                        <ProtectedRoute>
                          <PoseViewer />
                        </ProtectedRoute>
                      }
                    />
                    <Route path="/profile" element={<UserProfile />} />
                    <Route
                      path="/thirty-days-challenge"
                      element={
                        <ProtectedRoute>
                          <ThirtyDaysChallenge />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </Suspense>
              </main>
            </div>
          )}

          <Suspense fallback={null}>
            <GuidePopup />
          </Suspense>
        </div>
        </AchievementProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
