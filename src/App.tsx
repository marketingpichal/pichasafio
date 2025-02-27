import Page from "./page";
import AgeVerificationModal from "./components/VerificarEdad";
import JuicyAd from "./components/JuicyAds";

import { useState } from "react";

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
          <Page />
        </>
      )}
    </div>
  );
}
