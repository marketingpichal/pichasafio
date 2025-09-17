import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Page from "./page";
import AgeVerificationModal from "./components/VerificarEdad";
import PurchasePopup from "./components/PurchasePopup";
import Navbar from "./components/NavigationBar";
import FarmingCalculator from "./components/FarmingCalculator";
import KeguelChallengue from "./components/KeguelChallenge";
import RespirationCalendar from "./components/RespirationCalendar";
import Testimonials from "./components/TestimoniosAnonimos";
import Login from "./components/Login";
import Register from "./components/Register";
import ResetPassword from "./components/ResetPassword";
import CompleteProfile from "./components/CompleteProfile";
import Rutinas from "./components/Rutines";
import Chochasafio from "./components/Chochasafio";
import SexShop from "./components/Sexshop";
import TerminosYCondiciones from "./components/Terms";
import GuideStore from "./components/Guides/guideStore";
import PoseViewer from "./components/PoseViewer";
import UserProfile from "./components/UserProfile";
import ThirtyDaysChallenge from "./components/ThirtyDaysChanllenge";
import Asesorias from "./components/Asesorias";
import AsesoriasWidget from "./components/common/AsesoriasWidget";
import AsesoriasBanner from "./components/common/AsesoriasBanner";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { AuthProvider } from "./context/AuthProvider";
import DebugAuth from "./components/DebugAuth";
// import ConfigChecker from "./components/ConfigChecker";

// import PichasahurSidebar from "./components/common/PichasahurSidebar";
// import PichasahurFloatingButton from "./components/common/PichasahurFloatingButton";

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
  const [showPurchasePopup, setShowPurchasePopup] = useState(false);
  // const [isPichasahurOpen, setIsPichasahurOpen] = useState(false);

  const handleVerification = (verified: boolean) => {
    setIsVerified(verified);
    if (!verified) {
      window.location.href = "https://www.google.com";
    } else {
      // Mostrar popup de compra después de validar edad y términos
      setTimeout(() => {
        setShowPurchasePopup(true);
      }, 2000); // Esperar 2 segundos después de la validación
    }
  };

  const handleClosePurchasePopup = () => {
    setShowPurchasePopup(false);
  };

  const handlePurchase = () => {
    // Aquí se implementará la lógica de compra
    console.log('Iniciando proceso de compra...');
    setShowPurchasePopup(false);
  };

  // const openPichasahur = () => setIsPichasahurOpen(true);
  // const closePichasahur = () => setIsPichasahurOpen(false);

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-900">
        {/* <ConfigChecker /> */}
        {!isVerified && (
          <AgeVerificationModal onVerified={handleVerification} />
        )}
        {isVerified && (
          <div className="flex flex-col min-h-screen">
            <AsesoriasBanner variant="top" />
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
                <Route path="/reset-password" element={<ResetPassword />} />

                <Route path="/complete-profile" element={<CompleteProfile />} />
                <Route path="/rutinas" element={<Rutinas />} />
                <Route path="/chochasafio" element={<Chochasafio />} />
                {/* Pichasahur Floating Button   <Route path="/sexshop" element={<SexShop />} />*/}
                <Route path="/tyc" element={<TerminosYCondiciones />} />
                <Route path="/sexshop" element={<SexShop />} />
                <Route path="/asesorias" element={<Asesorias />} />
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
                <Route path="/debug-auth" element={<DebugAuth />} />
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
        
        {/* Widget de Asesorías - Visible en todas las páginas */}
        <AsesoriasWidget />
        
        {/* Popup de compra - Se muestra después de validar edad */}
        {showPurchasePopup && (
          <PurchasePopup
            isOpen={showPurchasePopup}
            onClose={handleClosePurchasePopup}
            onPurchase={handlePurchase}
          />
        )}
      </div>
    </AuthProvider>
  );
}
