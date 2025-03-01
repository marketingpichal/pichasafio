import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Page from "./page";
import AgeVerificationModal from "./components/VerificarEdad";
import Navbar from "./components/NavigationBar";
import FarmingCalculator from "./components/FarmingCalculator";
import KeguelChallengue from "./components/KeguelChallenge";
import RespirationCalendar from "./components/RespirationCalendar";
import Testimonials from "./components/TestimoniosAnonimos";
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
    <div className="min-h-screen bg-gray-900">
      {!isVerified && <AgeVerificationModal onVerified={handleVerification} />}
      {isVerified && (
        <>
          <Navbar />
          <Routes>
            <Route path="/" element={<Page />} />
            <Route path="/about" element={<About />} />
            <Route path="calculadora" element={<FarmingCalculator/>}/>
            <Route path="/keguel" element={<KeguelChallengue/>}></Route>
            <Route path="/respiracion" element={<RespirationCalendar/>}></Route>
            <Route path="/testimonios" element={<Testimonials/>}></Route>
          </Routes>
        </>
      )}
    </div>
  );
}
