// app.tsx
import Page from "./page";
import AgeVerificationModal from "./components/VerificarEdad";
import JuicyAd from "./components/JuicyAds";

import { useState } from 'react';


export default function App() {
  const [isVerified, setIsVerified] = useState(false);

  const handleVerification = (verified: boolean) => {
    setIsVerified(verified);
    if (!verified) {
      // Si dicen "No", podrías redirigirlos o mostrar un mensaje
      window.location.href = 'https://www.google.com'; // O lo que quieras
    }
  };
  return (
    <div className="min-h-screen bg-gray-900">
    {!isVerified && <AgeVerificationModal onVerified={handleVerification} />}
    {isVerified && (
      <>
      <JuicyAd adZoneId="TU_AD_ZONE_ID_AQUI" />
        <Page />
        
        {/* Aquí va el resto de tu contenido */}
      </>
    )}
  </div>
  );
}