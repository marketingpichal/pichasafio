import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Page from "./page";
import AgeVerificationModal from "./components/VerificarEdad";
import JuicyAd from "./components/JuicyAds";
import Navbar from "./components/NavigationBar"; // Importamos el nuevo componente

const About = () => <h2 className="text-white">Acerca de Nosotros</h2>;

export default function App() {
  const [isVerified, setIsVerified] = useState(false);

  const handleVerification = (verified: boolean) => {
    setIsVerified(verified);
    if (!verified) {
      window.location.href = "https://www.google.com";
    }
  };

  const zoneId = import.meta.env.VITE_APP_API_KEY_ADS as string;

  return (
    <div className="min-h-screen bg-gray-900">
      {!isVerified && <AgeVerificationModal onVerified={handleVerification} />}
      {isVerified && (
        <>
          <JuicyAd adZoneId={zoneId} />
          <Navbar /> {/* Añadimos la barra de navegación */}
          <Routes>
            <Route path="/" element={<Page />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </>
      )}
    </div>
  );
}