// Page.tsx
import DonationBanner from "./components/donations"; // Ajusta las rutas
import { Publicity } from "./components/Publicity";
import { Testimonial } from "./components/testimmonials";
import ThirtyDayChallenge from "./components/ThirtyDaysChanllenge";
import Header from "./components/header";
import Instructions from "./components/Instrucciones";
import Footer from "./components/Footer";
import Donate from "./components/DonacionesFull";
import InstruccionesPene from "./components/Warning";


export default function Page() {
  return (
    <div className="min-h-screen bg-gray-900">

      <section>
        <Header></Header>
      </section>
      <section>
        <InstruccionesPene></InstruccionesPene>
      </section>
      {/* Banners de Publicidad */}
      <section className="container mx-auto px-4 py-8">
        <Publicity />
      </section>
      <section>
        <Donate></Donate>
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



      {/* Reto de 30 Días */}
      <section className="container mx-auto px-4 py-8 md:py-12">
        <ThirtyDayChallenge />
      </section>

      <section className="container mx-auto px-4 py-8">
        <Footer />
      </section>
    </div>
  );
}