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
// import PichasahurSidebar from "./components/common/PichasahurSidebar";
// import PichasahurFloatingButton from "./components/common/PichasahurFloatingButton";

const About = () => (
  <div className="min-h-screen bg-gray-900 flex items-center justify-center">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
      <h2 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
        Acerca de Nosotros
      </h2>
      <p className="text-lg sm:text-xl text-gray-300 leading-relaxed">
        Pichasafio.com es tu comunidad para mejorar tu salud íntima y bienestar personal.
        Ofrecemos recursos, rutinas y herramientas para ayudarte en tu viaje de automejora.
      </p>
    </div>
  </div>
);

export default function App() {
  const [isVerified, setIsVerified] = useState(false);
  // const [isPichasahurOpen, setIsPichasahurOpen] = useState(false);

  const handleVerification = (verified: boolean) => {
    setIsVerified(verified);
    if (!verified) {
      window.location.href = "https://www.google.com";
    }
  };

  // const openPichasahur = () => setIsPichasahurOpen(true);
  // const closePichasahur = () => setIsPichasahurOpen(false);

  return (
    <div className="min-h-screen bg-gray-900">
      {!isVerified && <AgeVerificationModal onVerified={handleVerification} />}
      {isVerified && (
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Page />} />
              <Route path="/about" element={<About />} />
              <Route path="/calculadora" element={<FarmingCalculator />} />
              <Route path="/keguel" element={<KeguelChallengue />} />
              <Route path="/respiracion" element={<RespirationCalendar />} />
              <Route path="/testimonios" element={<Testimonials />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/rutinas" element={<Rutinas />} />
            </Routes>
          </main>
          
          {/* Pichasahur Floating Button */}
          {/* <PichasahurFloatingButton 
            onClick={openPichasahur} 
            isVisible={true} 
          /> */}
          
          {/* Pichasahur Sidebar */}
          {/* <PichasahurSidebar 
            isOpen={isPichasahurOpen} 
            onClose={closePichasahur} 
          /> */}
        </div>
      )}
    </div>
  );
}