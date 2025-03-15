import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Page from "./page";
import AgeVerificationModal from "./components/VerificarEdad";
import Navbar from "./components/NavigationBar";
import FarmingCalculator from "./components/FarmingCalculator";
import KeguelChallengue from "./components/KeguelChallenge";
import RespirationCalendar from "./components/RespirationCalendar";
import Testimonials from "./components/TestimoniosAnonimos";
import Login from "./components/Login";
import Register from "./components/Register";
import Rutinas from "./components/Rutines";
import { AuthProvider } from './context/AuthProvider';
import ProtectedRoute from "./components/ProtectedRoute";
import PublicMessage from "./components/PublicMessage";


const About = () => <h2 className="text-white">Acerca de Nosotros</h2>;

export default function App() {
  const [isVerified, setIsVerified] = useState(false);

  const handleVerification = (verified: boolean) => {
    setIsVerified(verified);
    if (!verified) {
      window.location.href = "https://www.google.com";
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-900">
        {!isVerified && <AgeVerificationModal onVerified={handleVerification} />}
        {isVerified && (
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <Page />
                </ProtectedRoute>
              } />
              <Route path="/about" element={<About />} />
              <Route path="calculadora" element={
                <ProtectedRoute>
                  <FarmingCalculator/>
                </ProtectedRoute>
              }/>
              <Route path="/keguel" element={
                <ProtectedRoute>
                  <KeguelChallengue/>
                </ProtectedRoute>
              }/>
              <Route path="/respiracion" element={
                <ProtectedRoute>
                  <RespirationCalendar/>
                </ProtectedRoute>
              }/>
              <Route path="/testimonios" element={
                <ProtectedRoute>
                  <Testimonials/>
                </ProtectedRoute>
              }/>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/rutinas" element={
                <ProtectedRoute>
                  <Rutinas />
                </ProtectedRoute>
              }/>
              {/* Remove this line */}
              {/* <Route path="*" element={<PublicMessage />} /> */}
            </Routes>
          </>
        )}
      </div>
    </AuthProvider>
  );
}
