import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Page from "./page";
import AgeVerificationModal from "./components/VerificarEdad";
import Navbar from "./components/NavigationBar";

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
          </Routes>
        </>
      )}
    </div>
  );
}
