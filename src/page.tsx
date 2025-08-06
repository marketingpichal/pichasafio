// Page.tsx
import DonationBanner from "./components/donations";
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
      {/* Hero Section */}
      <section className="relative">
        <Header />
      </section>

      {/* Warning Section */}
      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <InstruccionesPene />
        </div>
      </section>

      {/* Publicity Section */}
      <section className="py-8 sm:py-12 bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Publicity />
        </div>
      </section>

      {/* Donations Section */}
      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Donate />
        </div>
      </section>

      {/* Instructions Section */}
      <section className="py-8 sm:py-12 bg-gray-800/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Instructions />
        </div>
      </section>

      {/* Hero Content Section - Testimonial & Donation Banner */}
      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Testimonial */}
            <div className="order-2 lg:order-1">
              <div className="bg-gray-800/50 rounded-2xl p-6 sm:p-8 h-full">
                <Testimonial />
              </div>
            </div>
            
            {/* Donation Banner */}
            <div className="order-1 lg:order-2">
              <div className="bg-gray-800/50 rounded-2xl p-6 sm:p-8 h-full">
                <DonationBanner />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Thirty Day Challenge Section */}
      <section className="py-8 sm:py-12 bg-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <ThirtyDayChallenge />
        </div>
      </section>

      {/* Footer Section */}
      <section className="py-8 sm:py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Footer />
        </div>
      </section>
    </div>
  );
}