// Page.tsx
import DonationBanner from "./components/donations"; // Ajusta las rutas
import KeguelChallengue from "./components/KeguelChallenge";
import { Publicity } from "./components/Publicity";
import RespirationCalendar from "./components/RespirationCalendar";
import { Testimonial } from "./components/testimmonials";
import ThirtyDayChallenge from "./components/ThirtyDaysChanllenge";
import { WarzoneCalculator } from "./components/warzonecalculator";
import Header from "./components/header";
import Instructions from "./components/Instrucciones";
export default function Page() {
  return (
    <div className="min-h-screen bg-gray-900">

   
        <section>
            <Header></Header>
        </section>
        <section>
            <Instructions></Instructions>
    </section>

      {/* Sección Hero con Video y Donación */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="grid gap-8 md:grid-cols-2">
          <div className="w-full">
            <Testimonial />
          </div>
          <div className="w-full">
            <DonationBanner />
          </div>
        </div>
      </section>

      {/* Banners de Publicidad */}
      <section className="container mx-auto px-4 py-8">
        <Publicity />
      </section>

      {/* Reto de 30 Días */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <ThirtyDayChallenge />
      </section>

      {/* Calculadora de Warzone */}
      <section>
        <WarzoneCalculator />
      </section>

       {/* Respiracion */}
       <section className="container mx-auto px-4 py-8">
        <RespirationCalendar />
      </section>

       {/* Respiracion */}
       <section className="container mx-auto px-4 py-8">
        <KeguelChallengue />
      </section>
    </div>
  );
}